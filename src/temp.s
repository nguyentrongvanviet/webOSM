00000000000015e7 <phase_1>:
    15e7:	f3 0f 1e fa          	endbr64
    15eb:	48 83 ec 08          	sub    $0x8,%rsp
    15ef:	48 8d 35 5a 1b 00 00 	lea    0x1b5a(%rip),%rsi        # 3150 <_IO_stdin_used+0x150>
    15f6:	e8 d4 04 00 00       	call   1acf <strings_not_equal>
    15fb:	85 c0                	test   %eax,%eax
    15fd:	75 05                	jne    1604 <phase_1+0x1d>
    15ff:	48 83 c4 08          	add    $0x8,%rsp
    1603:	c3                   	ret
    1604:	e8 da 05 00 00       	call   1be3 <explode_bomb>
    1609:	eb f4                	jmp    15ff <phase_1+0x18>