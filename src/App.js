import React, { useState } from 'react';
import L from 'leaflet';
import axios from 'axios';
import MapView from './MapView';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { useAuth } from './hooks/useAuth';
import AuthCard from './components/AuthCard';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [locationName, setLocationName] = useState('');
  const [center, setCenter] = useState([16.0544, 108.2022]); // Default: Da Nang
  const [zoom, setZoom] = useState(13);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [translateText, setTranslateText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');
  const {
    user,
    authEnabled,
    authReady,
    authLoading,
    authError,
    signIn: handleGoogleSignIn,
    signOut: handleSignOut,
  } = useAuth();

  const handleTranslate = async () => {
    if (!authEnabled) {
      setTranslateError('Chưa cấu hình Firebase. Vui lòng thêm REACT_APP_FIREBASE_* và khởi động lại.');
      return;
    }

    if (!user) {
      setTranslateError('Vui lòng đăng nhập bằng Google để sử dụng tính năng dịch.');
      return;
    }

    if (!translateText.trim()) {
      setTranslateError('Vui lòng nhập văn bản để dịch');
      return;
    }

    setTranslating(true);
    setTranslateError('');
    setTranslatedText('');

    try {
      // Using Google Translate API alternative - MyMemory
      const response = await axios.get(
        'https://api.mymemory.translated.net/get',
        {
          params: {
            q: translateText,
            langpair: 'en|vi'
          }
        }
      );

      if (response.data && response.data.responseData && response.data.responseData.translatedText) {
        setTranslatedText(response.data.responseData.translatedText);
        setTranslateError('');
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslateError('Không thể dịch văn bản. Vui lòng thử lại.');
      setTranslatedText('');
    } finally {
      setTranslating(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    setWeatherLoading(true);
    setWeatherError('');

    try {
      const weatherResponse = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat,
            lon,
            units: 'metric',
            lang: 'vi',
            appid: '9e57b246097cce513dd9518fdf93cbb7'
          }
        }
      );

      setWeather(weatherResponse.data);
    } catch (err) {
      console.error('Weather error:', err);
      setWeather(null);
      setWeatherError('Không thể tải dữ liệu thời tiết lúc này.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!locationName.trim()) {
      setError('Vui lòng nhập tên địa điểm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Search for the location using Nominatim API
      const searchResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: `${locationName}, Vietnam`,
            format: 'json',
            limit: 1,
          },
          headers: {
            'User-Agent': 'VietnamMapApp/1.0'
          }
        }
      );

      if (searchResponse.data.length === 0) {
        setError('Không tìm thấy địa điểm. Vui lòng thử lại.');
        setWeather(null);
        setWeatherError('');
        setSelectedLocation(null);
        setLoading(false);
        return;
      }

      const location = searchResponse.data[0];
      const lat = parseFloat(location.lat);
      const lon = parseFloat(location.lon);
      const locationLabel = location.display_name?.split(',')?.[0] || locationName;

      setCenter([lat, lon]);
      setZoom(14);
      setSelectedLocation({ name: locationLabel, lat, lon });

      // Get points of interest around the location using Overpass API
      const overpassQuery = `
        [out:json];
        (
          node["tourism"](around:2000,${lat},${lon});
          node["amenity"="restaurant"](around:2000,${lat},${lon});
          node["amenity"="cafe"](around:2000,${lat},${lon});
          node["shop"](around:2000,${lat},${lon});
          node["historic"](around:2000,${lat},${lon});
        );
        out body 5;
      `;

      const poiResponse = await axios.post(
        'https://overpass-api.de/api/interpreter',
        overpassQuery,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );

      const pois = poiResponse.data.elements.map(element => ({
        id: element.id,
        lat: element.lat,
        lon: element.lon,
        name: element.tags.name || 'Không có tên',
        type: element.tags.tourism || element.tags.amenity || element.tags.shop || element.tags.historic || 'Điểm quan tâm',
      }));

      setPointsOfInterest(pois.slice(0, 5));
      await fetchWeather(lat, lon);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.');
      setWeather(null);
      setWeatherError('Không thể tải dữ liệu thời tiết lúc này.');
      setSelectedLocation(null);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  const weatherDescription = weather?.weather?.[0]?.description || '';
  const weatherIconUrl = weather?.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : null;
  const temperature = weather?.main?.temp;
  const feelsLike = weather?.main?.feels_like;
  const humidity = weather?.main?.humidity;
  const windSpeed = weather?.wind?.speed;

  const formatTemp = (value) =>
    typeof value === 'number' ? `${value.toFixed(1)}°C` : '--';
  const formatSpeed = (value) =>
    typeof value === 'number' ? `${value.toFixed(1)} m/s` : '--';

  const weatherMarker = weather && selectedLocation
    ? {
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        name: weather.name || selectedLocation.name,
        description: weatherDescription,
        temperature: formatTemp(temperature),
        feelsLike: formatTemp(feelsLike),
        humidity: typeof humidity === 'number' ? `${humidity}%` : '--',
        wind: formatSpeed(windSpeed),
        icon: weatherIconUrl,
      }
    : null;

  const translationDisabled = translating || !user || !authEnabled;

  return (
    <div className="App">
      <div className="map-wrapper">
        <MapView
          center={center}
          zoom={zoom}
          pointsOfInterest={pointsOfInterest}
          weatherMarker={weatherMarker}
        />
        <div className="map-ui">
          <AuthCard
            user={user}
            authEnabled={authEnabled}
            authReady={authReady}
            authLoading={authLoading}
            authError={authError}
            onSignIn={handleGoogleSignIn}
            onSignOut={handleSignOut}
          />

          <div className="search-card">
            <div className="search-card-title">
              <span>Bản đồ Việt Nam</span>
              <p>Nhập tên địa điểm để xem vị trí và thời tiết hiện tại.</p>
            </div>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Hà Nội, Sài Gòn, Đà Nẵng..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="search-button"
                onClick={searchLocation}
                disabled={loading}
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </div>
          </div>

          {error && <div className="error-chip">{error}</div>}

          {weatherLoading && (
            <div className="info-chip">Đang tải thông tin thời tiết...</div>
          )}

          {weatherError && !weatherLoading && (
            <div className="error-chip">{weatherError}</div>
          )}

          <div className="translate-panel">
            <div className="translate-header">
              <span>Dịch thuật</span>
              <span className="translate-subtitle">Anh → Việt</span>
            </div>
            {!authEnabled && (
              <div className="auth-reminder">
                Cần cấu hình Firebase (.env) để bật đăng nhập Google cho tính năng dịch thuật.
              </div>
            )}
            {authEnabled && !user && (
              <div className="auth-reminder">
                Đăng nhập Google để sử dụng tính năng dịch thuật.
              </div>
            )}
            <textarea
              className="translate-input"
              placeholder="Nhập văn bản tiếng Anh..."
              value={translateText}
              onChange={(e) => setTranslateText(e.target.value)}
              rows="3"
              disabled={!authEnabled || !user}
            />
            <button
              className="translate-button"
              onClick={handleTranslate}
              disabled={translationDisabled}
            >
              {translating ? 'Đang dịch...' : 'Dịch'}
            </button>
            {translateError && (
              <div className="translate-error">{translateError}</div>
            )}
            {translatedText && (
              <div className="translate-output">
                <strong>Bản dịch:</strong>
                <p>{translatedText}</p>
              </div>
            )}
          </div>

          {pointsOfInterest.length > 0 && (
            <div className="poi-panel">
              <div className="poi-panel-header">
                <span>Điểm quan tâm</span>
                <span>{pointsOfInterest.length}</span>
              </div>
              <ul>
                {pointsOfInterest.map((poi) => (
                  <li key={poi.id}>
                    <strong>{poi.name}</strong>
                    <span>{poi.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
