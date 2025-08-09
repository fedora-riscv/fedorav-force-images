<details>

<summary>使用 QEMU 启动 Fedora RISC-V 镜像教程</summary>

本教程将引导你如何在 QEMU 虚拟机中启动 Fedora RISC-V 镜像。你将学习如何设置必要的软件并运行两种不同模式的虚拟机：一种带有图形化界面，另一种则通过命令行（console）远程访问。

-----

## 步骤 1: 安装必要的软件包

首先，你需要安装 qemu-system-riscv64 和 edk2-riscv64 这两个软件包。在 Fedora 系统中，你可以使用 dnf 命令来安装它们：

```bash
sudo dnf install qemu-system-riscv64 edk2-riscv64
```

-----

## 步骤 2: 下载并解压 Fedora RISC-V 镜像

镜像下载完成后，请将文件解压。解压后会得到一个 .img 文件，例如 qemu-kde.img。

-----

## 步骤 3: 启动虚拟机

你现在有两种方式来启动虚拟机，具体取决于你的需求。

### 方式 1: 启动带有图形界面的虚拟机

如果你希望通过一个独立的窗口来运行虚拟机，可以使用以下命令。这个命令会创建一个带有图形显示、鼠标和键盘的完整桌面环境。

请将命令中的 qemu-kde.img 替换为你实际的镜像文件名。

```bash
qemu-system-riscv64 -M virt,pflash0=pflash0,acpi=off \
  -m 6G -smp 4 \
  -blockdev node-name=pflash0,read-only=on,driver=qcow2,file.driver=file,file.filename=/usr/share/edk2/riscv/RISCV_VIRT_CODE.qcow2 \
  -device virtio-blk-pci,drive=hd0 \
  -device virtio-net-device,netdev=usernet \
  -netdev user,id=usernet \
  -device virtio-vga \
  -device qemu-xhci -usb -device usb-kbd -device usb-tablet \
  -drive file=qemu-kde.img,format=raw,id=hd0,if=none \
  -cpu rv64
```

运行后，一个 QEMU 窗口将弹出，并在其中显示 Fedora 的桌面环境。

### 方式 2: 启动无图形界面的虚拟机（通过 console 远程查看）

如果你想通过远程连接或者在命令行中查看虚拟机，可以使用这个方式。

请将命令中的 qemu.img 替换为你实际的镜像文件名。

```bash
qemu-system-riscv64 -M virt,pflash0=pflash0,acpi=off \
  -m 6G -smp 4 \
  -nographic \
  -blockdev node-name=pflash0,read-only=on,driver=qcow2,file.driver=file,file.filename=/usr/share/edk2/riscv/RISCV_VIRT_CODE.qcow2 \
  -device virtio-blk-pci,drive=hd0 \
  -device virtio-net-device,netdev=usernet \
  -netdev user,id=usernet \
  -drive file=qemu.img,format=raw,id=hd0,if=none
```

运行后，你将在终端中看到虚拟机的启动日志和登录提示符。

</details>

<details>
<summary>How to Launch a Fedora RISC-V Image with QEMU</summary>

This tutorial will show you how to boot a Fedora RISC-V image in a QEMU virtual machine. You'll learn how to set up the necessary software and run the VM in two different ways: one with a graphical interface and another for remote console access.

-----

## Step 1: Install the Necessary Packages

First, you need to install the **qemu-system-riscv64** and **edk2-riscv64** packages. On a Fedora system, you can use the **dnf** command to install them:

```bash
sudo dnf install qemu-system-riscv64 edk2-riscv64
```

-----

## Step 2: Download and Unpack the Fedora RISC-V Image

After you've downloaded the image, you'll need to unpack the file. This will give you a **.img** file, like `qemu-kde.img`.

-----

## Step 3: Launch the Virtual Machine

You have two ways to launch the virtual machine, depending on what you need.

### Option 1: Launch with a Graphical Interface

If you want to run the VM in a dedicated window, use this command. It creates a full desktop environment with a graphical display, mouse, and keyboard.

Be sure to replace `qemu-kde.img` with the actual name of your image file.

```bash
qemu-system-riscv64 -M virt,pflash0=pflash0,acpi=off \
  -m 6G -smp 4 \
  -blockdev node-name=pflash0,read-only=on,driver=qcow2,file.driver=file,file.filename=/usr/share/edk2/riscv/RISCV_VIRT_CODE.qcow2 \
  -device virtio-blk-pci,drive=hd0 \
  -device virtio-net-device,netdev=usernet \
  -netdev user,id=usernet \
  -device virtio-vga \
  -device qemu-xhci -usb -device usb-kbd -device usb-tablet \
  -drive file=qemu-kde.img,format=raw,id=hd0,if=none \
  -cpu rv64
```

After you run this, a QEMU window will pop up, showing you the Fedora desktop.

### Option 2: Launch Without a Graphical Interface (for Remote Console Viewing)

If you want to connect remotely or view the VM from the command line, this is the option to use.

Be sure to replace `qemu.img` with the actual name of your image file.

```bash
qemu-system-riscv64 -M virt,pflash0=pflash0,acpi=off \
  -m 6G -smp 4 \
  -nographic \
  -blockdev node-name=pflash0,read-only=on,driver=qcow2,file.driver=file,file.filename=/usr/share/edk2/riscv/RISCV_VIRT_CODE.qcow2 \
  -device virtio-blk-pci,drive=hd0 \
  -device virtio-net-device,netdev=usernet \
  -netdev user,id=usernet \
  -drive file=qemu.img,format=raw,id=hd0,if=none
```

Once you run this command, you'll see the VM's boot logs and login prompt right in your terminal.

</details>