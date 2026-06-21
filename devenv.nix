{ pkgs, lib, config, inputs, ... }:

let
  playwrightDeps = with pkgs; [
    gtk3
    cairo
    pango
    atk
    gdk-pixbuf
    glib
    alsa-lib
    dbus
    xorg.libX11
    xorg.libXcomposite
    xorg.libXcursor
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXi
    xorg.libXrandr
    xorg.libXrender
    xorg.libxcb
    stdenv.cc.cc.lib
  ];
in {
  packages = playwrightDeps;

  languages.javascript = {
    enable = true;
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  enterShell = ''
    export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath playwrightDeps}:$LD_LIBRARY_PATH"
    echo "Devenv ready with Playwright system libraries mapped!"
  '';
}
