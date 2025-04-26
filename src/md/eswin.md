<details>

<summary>ESWIN Board GRUB Boot Tutorial</summary>

## Method 1: Update Directly from Boot Media

This method requires using a system image updated **after April 26, 2025**.

1.  **Flash the Image:** Write the updated system image to your chosen boot medium (e.g., eMMC, SD card, USB drive).
2.  **Identify the Boot Device:**
    * Power on the board and interrupt the U-Boot sequence (usually by pressing a key repeatedly during boot).
    * At the U-Boot prompt (`=>`), run the `lsblk` command to list available block devices:
        ```bash
        => lsblk
        Block Driver         Devices
        -----------------------------
        dwc_ahsata_blk     : <none>
        efi_blk            : <none>
        mmc_blk            : mmc 0, mmc 1
        nvme-blk           : <none>
        sata_blk           : <none>
        usb_storage_blk    : usb 0
        ```
    * Identify your boot device based on the output and where you flashed the image:
        * eMMC is typically `mmc 0`.
        * SD card is typically `mmc 1`.
        * USB drive is typically `usb 0`.
        * Note the exact device name shown by `lsblk`.
3.  **Load and Run Update Script:**
    * Execute the following commands at the U-Boot prompt, replacing `<device>` with the name identified in the previous step (e.g., `mmc 1` if using an SD card).
        ```bash
        load <device> 0x90000000 update.scr;
        source 0x90000000
        ```
    * For example, if booting from an SD card (`mmc 1`):
        ```bash
        load mmc 1 0x90000000 update.scr;
        source 0x90000000
        ```
4.  **Reboot:** Type `reset` and press Enter.
    ```bash
    reset
    ```
    The board will reboot and should automatically boot into the system.

## Method 2: Using Pre-built Update Image

1.  **Download the Image:** Download the update image file `update.disk.gz` from:
    [https://openkoji.iscas.ac.cn/pub/dist-repos/dl/ESWIN/EIC7700/fw/update.disk.gz](https://openkoji.iscas.ac.cn/pub/dist-repos/dl/ESWIN/EIC7700/fw/update.disk.gz)
2.  **Flash the Image:** Use a tool like `balenaEtcher` to write the downloaded `update.disk.gz` image onto an SD card or USB drive.
3.  **Run Update Command:**
    * Insert the prepared SD card or USB drive into the board.
    * Power on the board and interrupt the U-Boot sequence.
    * At the U-Boot prompt (`=>`), run the appropriate command:
        * If using an **SD card**:
            ```bash
            run sdupdate
            ```
        * If using a **USB drive**:
            ```bash
            run usbupdate
            ```
    * The update process will begin. Once finished, reboot the board.

## Recovery Procedure

If you need to restore the default U-Boot environment settings:

1.  **Interrupt U-Boot:** Power on or reset the board. During the initial boot messages, repeatedly press `Ctrl+C` to interrupt the U-Boot sequence and get to the `=>` prompt.
2.  **Run Recovery Command:** Enter the following command:
    ```bash
    run env_recover
    ```
3.  **Reboot:** Enter the `reset` command to reboot the board with the default environment.
    ```bash
    reset
    ```
</details>

<details>

<summary>ESWIN 开发板GRUB启动教程</summary>

## 方法一：直接从启动介质中更新

此方法需要使用 **2025年4月26日之后** 更新的系统镜像。

1.  **刷入镜像:** 将更新后的系统镜像烧写到您选择的启动介质中（例如 eMMC、SD 卡、U 盘）。
2.  **识别启动设备:**
    * 给开发板上电，并在启动过程中（通常在看到启动信息时反复按某个键）中断 U-Boot 启动流程。
    * 在 U-Boot 提示符 (`=>`) 下，运行 `lsblk` 命令列出可用的块设备：
        ```bash
        => lsblk
        Block Driver         Devices
        -----------------------------
        dwc_ahsata_blk     : <none>
        efi_blk            : <none>
        mmc_blk            : mmc 0, mmc 1
        nvme-blk           : <none>
        sata_blk           : <none>
        usb_storage_blk    : usb 0
        ```
    * 根据 `lsblk` 的输出以及您刷入镜像的位置来确定您的启动设备：
        * eMMC 通常是 `mmc 0`。
        * SD 卡通常是 `mmc 1`。
        * U 盘通常是 `usb 0`。
        * 请留意 `lsblk` 显示的确切设备名称。
3.  **加载并运行更新脚本:**
    * 在 U-Boot 提示符下执行以下命令，将 `<device>` 替换为您在上一步中识别出的设备名称（例如，如果使用 SD 卡，则为 `mmc 1`）。
        ```bash
        load <device> 0x90000000 update.scr;
        source 0x90000000
        ```
    * 例如，如果从 SD 卡 (`mmc 1`) 启动：
        ```bash
        load mmc 1 0x90000000 update.scr;
        source 0x90000000
        ```
4.  **重启:** 输入 `reset` 并按回车键。
    ```bash
    reset
    ```
    开发板将会重启，并应能自动进入系统。

## 方法二：使用预制的更新镜像

1.  **下载镜像:** 从以下地址下载更新镜像文件 `update.disk.gz`：
    [https://openkoji.iscas.ac.cn/pub/dist-repos/dl/ESWIN/EIC7700/fw/update.disk.gz](https://openkoji.iscas.ac.cn/pub/dist-repos/dl/ESWIN/EIC7700/fw/update.disk.gz)
2.  **烧写镜像:** 使用如 `balenaEtcher` 之类的工具，将下载的 `update.disk.gz` 镜像文件烧写到 SD 卡或 U 盘中。
3.  **运行更新命令:**
    * 将准备好的 SD 卡或 U 盘插入开发板。
    * 给开发板上电并中断 U-Boot 启动流程。
    * 在 U-Boot 提示符 (`=>`) 下，运行对应的命令：
        * 如果使用 **SD 卡**:
            ```bash
            run sdupdate
            ```
        * 如果使用 **U 盘**:
            ```bash
            run usbupdate
            ```
    * 更新过程将会开始。完成后，重启开发板。

## 如何恢复

如果您需要恢复 U-Boot 的默认环境变量设置：

1.  **中断 U-Boot:** 给开发板上电或复位。在最初的启动信息出现时，反复按 `Ctrl+C` 组合键，直到进入 U-Boot 的 `=>` 提示符。
2.  **运行恢复命令:** 输入以下命令：
    ```bash
    run env_recover
    ```
3.  **重启:** 输入 `reset` 命令，使用默认环境重启开发板。
    ```bash
    reset
    ```

---

</details>

<details>

<summary>在ESWIN板子上启动Fedora (旧版)</summary>

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