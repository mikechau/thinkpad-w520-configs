const Applet = imports.ui.applet;
const Cinnamon = imports.gi.Cinnamon;
const GLib = imports.gi.GLib;
const GTop = imports.gi.GTop;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const NetworkManager = imports.gi.NetworkManager;
const Main = imports.ui.main;
const Settings = imports.ui.settings; // Needed for settings API

const UUID = "netusagemonitor@pdcurtis"

function MyApplet(metadata, orientation, panel_height, instance_id) {
    this._init(metadata, orientation, panel_height, instance_id);
};

MyApplet.prototype = {
    __proto__: Applet.Applet.prototype,
    _init: function (metadata, orientation, panel_height, instance_id) {
        Applet.Applet.prototype._init.call(this, orientation, panel_height, instance_id);
        try {
            this.labelDownload = new St.Label({
                reactive: true,
                track_hover: true,
                style_class: "netspeed-applet"
            });
            this.labelUpload = new St.Label({
                reactive: true,
                track_hover: true,
                style_class: "netspeed-applet"
            });
            this.actor.add(this.labelDownload, {
                y_align: St.Align.MIDDLE,
                y_fill: false
            });
            this.actor.add(this.labelUpload, {
                y_align: St.Align.MIDDLE,
                y_fill: false
            });

            this.settings = new Settings.AppletSettings(this, UUID, instance_id);
            this.settings.bindProperty(Settings.BindingDirection.IN,
                "refreshInterval-spinner",
                "refreshIntervalIn",
                this.on_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.IN,
                "decimalsToShow-spinner",
                "decimalsToShowIn",
                this.on_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "monitored-interface",
                "monitoredIinterfaceBi",
                this.on_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.IN,
                "useDefaultInterface",
                "useDefaultInterfaceIn",
                this.on_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.IN,
                "defaultInterface",
                "defaultInterfaceIn",
                this.on_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.IN,
                "useTotalLimit",
                "useTotalLimit",
                this.on_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.IN,
                "totalLimit",
                "totalLimit",
                this.on_alert_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "alertPercentage",
                "alertPercentage",
                this.on_alert_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeInterface1",
                "cumulativeInterface1",
                this.on_interface_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeComment1",
                "cumulativeComment1",
                this.on_interface_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeTotal1",
                "cumulativeTotal1",
                this.on_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeInterface2",
                "cumulativeInterface2",
                this.on_interface_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeComment2",
                "cumulativeComment2",
                this.on_interface_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeTotal2",
                "cumulativeTotal2",
                this.on_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeInterface3",
                "cumulativeInterface3",
                this.on_interface_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeComment3",
                "cumulativeComment3",
                this.on_interface_settings_changed,
                null);
            this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL,
                "cumulativeTotal3",
                "cumulativeTotal3",
                this.on_settings_changed,
                null);
            // Set up left click menu
            this.menuManager = new PopupMenu.PopupMenuManager(this);
            this.menu = new Applet.AppletPopupMenu(this, orientation);
            this.menuManager.addMenu(this.menu);
            this.makeMenu();

            this.gtop = new GTop.glibtop_netload();
            this.timeOld = GLib.get_monotonic_time();
            this.upOld = 0;
            this.downOld = 0;
            this.upOldC1 = 0;
            this.downOldC1 = 0;
            this.upOldC2 = 0;
            this.downOldC3 = 0;
            this.upOldC2 = 0;
            this.downOldC3 = 0;


            this.monitoredInterfaceName = null;
            let lastUsedInterface = this.monitoredIinterfaceBi;

            this.set_applet_tooltip("No Interface being Monitored - right click to select");
            if (this.useDefaultInterfaceIn) {
                this.setMonitoredInterface(this.defaultInterfaceIn);
            }
            if (this.isInterfaceAvailable(lastUsedInterface) || lastUsedInterface == "ppp0") {
                this.setMonitoredInterface(lastUsedInterface);
            }
            this.rebuildFlag = true;
            this.on_settings_changed();
            this.update();
        } catch (e) {
            global.logError(e);
        }
    },

    on_settings_changed: function () {
        if (this.useTotalLimit) {
            this.slider_demo.setValue(this.alertPercentage / 100);
        }
        this.updateLeftMenu();
    },
    on_alert_settings_changed: function () {
        this.makeMenu;
        this.on_settings_changed
    },

    on_interface_settings_changed: function () {
        this.makeMenu;
        this.on_settings_changed
    },

    on_slider_changed: function (slider, value) {
        this.alertPercentage = value * 100;
        this.updateLeftMenu();
    },


    getInterfaces: function () {
        return imports.gi.NMClient.Client.new().get_devices();
    },

    isInterfaceAvailable: function (name) {
        let interfaces = this.getInterfaces();
        if (interfaces != null) {
            for (let i = 0; i < interfaces.length; i++) {
                let iname = interfaces[i].get_iface();
                if (iname == name && interfaces[i].state == NetworkManager.DeviceState.ACTIVATED) {
                    return true;
                }
            }
        }
        return false;
    },
    // Build left click menu - some menu items are placeholders which are updated on changes and some are conditional
    makeMenu: function () {
        this.menu.removeAll();
        this.menuitemHead1 = new PopupMenu.PopupMenuItem("Cummulative Data Usage Information", {
            reactive: false
        });
        this.menu.addMenuItem(this.menuitemHead1);
        if (this.cumulativeInterface1 != "null" && this.cumulativeInterface1 != "") {
            this.menuitemInfo1 = new PopupMenu.PopupMenuItem("Cumulative data placeholder 1", {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo1);
            this.menuitemInfo3 = new PopupMenu.PopupMenuItem("       " + this.cumulativeComment1, {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo3);
        }
        if (this.cumulativeInterface2 != "null" && this.cumulativeInterface2 != "") {
            this.menuitemInfo4 = new PopupMenu.PopupMenuItem("Cumulative data placeholder 2", {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo4);
            this.menuitemInfo5 = new PopupMenu.PopupMenuItem("       " + this.cumulativeComment2, {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo5);
        }
        if (this.cumulativeInterface3 != "null" && this.cumulativeInterface3 != "") {
            this.menuitemInfo6 = new PopupMenu.PopupMenuItem("Cumulative data placeholder 3", {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo6);
            this.menuitemInfo7 = new PopupMenu.PopupMenuItem("       " + this.cumulativeComment3, {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo7);
        }

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem())
        this.menuitemHead2 = new PopupMenu.PopupMenuItem("Current Connection and Interface Information", {
            reactive: false
        });
        this.menu.addMenuItem(this.menuitemHead2);

        if (this.monitoredInterfaceName != null) {
            this.menuitemInfo = new PopupMenu.PopupMenuItem("placeholder", {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo);
            this.menuitemInfo.label.text = "    " + this.monitoredInterfaceName + " - Downloaded: " + this.formatSentReceived(this.downOld) + " - Uploaded: " + this.formatSentReceived(this.upOld);
        } else {
            this.menuitemInfo = new PopupMenu.PopupMenuItem("No network monitored. Please select one right-clicking the applet.", {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo);
        }
        //	Slider only if Alerts enabled
        if (this.useTotalLimit) {
            this.menuitemInfo2 = new PopupMenu.PopupMenuItem("     Note: Alerts not enabled in Settings", {
                reactive: false
            });
            this.menu.addMenuItem(this.menuitemInfo2);
            this.slider_demo = new PopupMenu.PopupSliderMenuItem(0);
            this.slider_demo.connect("value-changed", Lang.bind(this, this.on_slider_changed));
            this.menu.addMenuItem(this.slider_demo);
        }
        this.updateLeftMenu(); // Updates values where placeholder used.
        this.on_settings_changed();
    },

    // Update left menu
    updateLeftMenu: function () {

        if (this.useTotalLimit) {
            this.menuitemInfo2.label.text = "    " + "Alert level (Orange): " + Math.round(this.alertPercentage) + " % of Data Limit of " + this.totalLimit + " MBytes.";
        }
        if (this.cumulativeInterface1 != "null" && this.cumulativeInterface1 != "") {
            this.menuitemInfo1.label.text = "   " + this.cumulativeInterface1 + " - Cumulative Data Usage: " + this.formatSentReceived(this.cumulativeTotal1 * 1024 * 1024);
        }
        if (this.cumulativeInterface2 != "null" && this.cumulativeInterface2 != "") {
            this.menuitemInfo4.label.text = "   " + this.cumulativeInterface2 + " - Cumulative Data Usage: " + this.formatSentReceived(this.cumulativeTotal2 * 1024 * 1024);
        }
        if (this.cumulativeInterface3 != "null" && this.cumulativeInterface3 != "") {
            this.menuitemInfo6.label.text = "   " + this.cumulativeInterface3 + " - Cumulative Data Use: " + this.formatSentReceived(this.cumulativeTotal3 * 1024 * 1024);
        }
    },

    // Build right click context menu
    buildContextMenu: function () {
        this._applet_context_menu.removeAll();
        this._applet_context_menu.addMenuItem(new PopupMenu.PopupMenuItem("Select a network manager interface to be monitored:", {
            reactive: false
        }));

        let interfaces = this.getInterfaces();
        if (interfaces != null) {
            for (let i = 0; i < interfaces.length; i++) {
                let name = interfaces[i].get_iface();
                let displayname = "\t" + name;
                if (this.isInterfaceAvailable(name)) {
                    displayname = displayname + " (Active)";
                }
                if (this.monitoredInterfaceName == name) {
                    displayname = "*" + displayname;
                }
                let menuitem = new PopupMenu.PopupMenuItem(displayname);
                menuitem.connect('activate', Lang.bind(this, function () {
                    this.setMonitoredInterface(name);
                }));
                this._applet_context_menu.addMenuItem(menuitem);
            }
        }

        this._applet_context_menu.addMenuItem(new PopupMenu.PopupMenuItem("or Select an independent interface to be monitored:", {
            reactive: false
        }));

        let displayname2 = "\t" + "ppp0     (for most USB Mobile Internet Modems)";
        if (this.monitoredInterfaceName == "ppp0") {
            displayname2 = "*" + displayname2;
        }
        let menuitem = new PopupMenu.PopupMenuItem(displayname2);
        menuitem.connect('activate', Lang.bind(this, function () {
            this.setMonitoredInterface("ppp0");
        }));
        this._applet_context_menu.addMenuItem(menuitem)

        this._applet_context_menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        let menuitem = new PopupMenu.PopupMenuItem("Settings");
        menuitem.connect('activate', Lang.bind(this, function (event) {
            GLib.spawn_command_line_async('cinnamon-settings applets ' + UUID);
        }));

        this._applet_context_menu.addMenuItem(menuitem);
        let menuitem = new PopupMenu.PopupMenuItem("Check for Changes in Devices");
        menuitem.connect('activate', Lang.bind(this, function (event) {
            this.rebuildFlag = true;
        }));

        this._applet_context_menu.addMenuItem(menuitem);
        let menuitem = new PopupMenu.PopupMenuItem("Open System Monitor");
        menuitem.connect('activate', Lang.bind(this, function (event) {
            GLib.spawn_command_line_async('gnome-system-monitor');
        }));
        this._applet_context_menu.addMenuItem(menuitem);
    },

    setMonitoredInterface: function (name) {
        this.monitoredInterfaceName = name;
        this.rebuildFlag = true;
        // This is a convenient place to ensure upOld and downOld are reset after change of interface or start-up
        GTop.glibtop_get_netload(this.gtop, this.monitoredInterfaceName);
        this.upOld = this.gtop.bytes_out;
        this.downOld = this.gtop.bytes_in;

        GTop.glibtop_get_netload(this.gtop, this.cumulativeInterface1);
        this.upOldC1 = this.gtop.bytes_out;
        this.downOldC1 = this.gtop.bytes_in;

        GTop.glibtop_get_netload(this.gtop, this.cumulativeInterface2);
        this.upOldC2 = this.gtop.bytes_out;
        this.downOldC2 = this.gtop.bytes_in;

        GTop.glibtop_get_netload(this.gtop, this.cumulativeInterface3);
        this.upOldC3 = this.gtop.bytes_out;
        this.downOldC3 = this.gtop.bytes_in;

        this.monitoredIinterfaceBi = name; // save using cinnamon settings
 //       this.set_applet_tooltip("Monitored interface: " + this.monitoredInterfaceName);
    },

    on_applet_clicked: function (event) {
        if (!this.menu.isOpen) {
            this.makeMenu();
        }
        this.menu.toggle();

    },
    // This is the main update run in a loop with a timer 
    update: function () {
        if (this.monitoredInterfaceName != null) {
            let timeNow = GLib.get_monotonic_time();
            let deltaTime = (timeNow - this.timeOld) / 1000000;
            GTop.glibtop_get_netload(this.gtop, this.monitoredInterfaceName);
            let upNow = this.gtop.bytes_out;
            let downNow = this.gtop.bytes_in;
            if (deltaTime != 0) {
                this.labelDownload.set_text("D: " + this.formatSpeed((downNow - this.downOld) / deltaTime));
                this.labelUpload.set_text("U: " + this.formatSpeed((upNow - this.upOld) / deltaTime));
            }
            // Update Old values
            this.upOld = upNow;
            this.downOld = downNow;
            this.timeOld = timeNow;
        } else {
            this.labelDownload.set_text("No Interface Set!");
        }
        // Update the three sets of cumulative usage data - Note this uses feature that gTop... delivers 0 if Interface does not exist or is inactive
        GTop.glibtop_get_netload(this.gtop, this.cumulativeInterface1);
        let upNowC1 = this.gtop.bytes_out;
        let downNowC1 = this.gtop.bytes_in;
        if (((downNowC1 > this.downOldC1) || (upNowC1 > this.upOldC1))) {
            this.cumulativeTotal1 = this.cumulativeTotal1 + (downNowC1 - this.downOldC1 + upNowC1 - this.upOldC1) / 1048576;
        }
        this.upOldC1 = upNowC1;
        this.downOldC1 = downNowC1;

        GTop.glibtop_get_netload(this.gtop, this.cumulativeInterface2);
        let upNowC2 = this.gtop.bytes_out;
        let downNowC2 = this.gtop.bytes_in;
        if (((downNowC2 > this.downOldC2) || (upNowC2 > this.upOldC2))) {
            this.cumulativeTotal2 = this.cumulativeTotal2 + (downNowC2 - this.downOldC2 + upNowC2 - this.upOldC2) / 1048576;
        }
        this.upOldC2 = upNowC2;
        this.downOldC2 = downNowC2;

        GTop.glibtop_get_netload(this.gtop, this.cumulativeInterface3);
        let upNowC3 = this.gtop.bytes_out;
        let downNowC3 = this.gtop.bytes_in;
        if (((downNowC3 > this.downOldC3) || (upNowC3 > this.upOldC3))) {
            this.cumulativeTotal3 = this.cumulativeTotal3 + (downNowC3 - this.downOldC3 + upNowC3 - this.upOldC3) / 1048576;
        }
        this.upOldC3 = upNowC3;
        this.downOldC3 = downNowC3;

        // Now set up tooltip every cycle
          if(this.monitoredInterfaceName != null) {
        	this.set_applet_tooltip("Interface: " + this.monitoredInterfaceName + " - Downloaded: " + this.formatSentReceived(this.downOld) + " - Uploaded: " + this.formatSentReceived(this.upOld));
		}
        // Update selected items in left click menu every cycle
        this.menuitemInfo.label.text = "    " + this.monitoredInterfaceName + " - Downloaded: " + this.formatSentReceived(this.downOld) + " - Uploaded: " + this.formatSentReceived(this.upOld);

        //  rebuild Right Click menu but only when required and after changes flagged as it is a slow activity
        if (this.rebuildFlag) {
            this.rebuildFlag = false;
            this.buildContextMenu();
        }
        // Set background colour - green when data has flowed, orange when alert level reached and red when data limit reached
        //this.actor.style = "background-color: black";
        //if ((this.downOld + this.upOld) > 0) {
        //    this.actor.style = "background-color: rgba(0,75,0,1.0)";
        //}
        //if (this.useTotalLimit) {
        //    if ((this.downOld + this.upOld) / 1048576 > this.totalLimit * this.alertPercentage / 100) {
        //        this.actor.style = "background-color: orange";
        //    }
        //    if ((this.downOld + this.upOld) / 1048576 > this.totalLimit) {
        //        this.actor.style = "background-color: red";
        //    }
        //}
        // Loop update
        let timer = this.refreshIntervalIn * 1000;
        Mainloop.timeout_add((timer), Lang.bind(this, this.update));
    },

    formatSpeed: function (value) {
        let decimalAdjust = Math.pow(10, (this.decimalsToShowIn));
        if (value < 1048576) return ((Math.round(value / 1024 * decimalAdjust) / decimalAdjust)).toFixed(2) + " KB/s";
        else return ((Math.round(value / 1048576 * decimalAdjust) / decimalAdjust)).toFixed(2) + " MB/s";
    },

    formatSentReceived: function (value) {
        if (value < 1048576) return Math.round(value / 1024) + " KB";
        else return Math.round((value / 1048576) * 10) / 10 + " MB";
    },

    on_applet_removed_from_panel: function () {
        this.settings.finalize();
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    let myApplet = new MyApplet(metadata, orientation, panel_height, instance_id);
    return myApplet;
}
/* 
Version v18_1.0 27-06-2013 
*/
