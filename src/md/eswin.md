<details>

<summary>在ESWIN板子上启动Fedora</summary>

# 0x01 下载镜像

下载并烧录镜像到SD卡

# 0x02 启动板子的 u-boot

确保启动开发板的 u-boot，将开发板拨到可启动的开关（从1~4，EMMC启动为1000，USB启动为1100，SPI启动为0100）

插入SD卡，启动板子的 u-boot，在启动过程中按空格键打断启动过程，输入以下命令（此处SD卡的dev num为1，uboot存放在第二个分区）

```bash
ls mmc 1:2 /;
load mmc 1:2 0x90000000 bootloader_secboot_ddr5_boot_from_sdcard_eic-7700.bin

# 注意一定上面的返回要为OK才继续刷入，不然可能会刷坏uboot，要用救砖的方法来救
es_burn write 0x90000000 flash;

# 断电
```

# 0x03 从SPI启动Fedora

断电，将boot的开关拨至0100，保持SD卡插入并重启开发板，可以正常进入系统

![diagram](md/eswin/diagram.png)

</details>