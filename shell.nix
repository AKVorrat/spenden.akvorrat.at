with import <nixpkgs> { };

let
  cfg = {
      nginxPort = "8080";
  };

  rootDir   = toString ./.;
  nginxDir  = "${rootDir}/nixfiles/nginx";
  phpDir    = "${rootDir}/nixfiles/php";

  phpConf       = (import ./nixfiles/php/phpfpm-nginx.conf.nix) {inherit pkgs phpDir ;};
  phpIni        = (import ./nixfiles/php/phpini.nix) {inherit pkgs ;};
  nginxConf     = (import ./nixfiles/nginx/nginx.conf.nix) {inherit pkgs nginxDir rootDir phpDir; nginxPort = cfg.nginxPort; };

in

pkgs.mkShell {
  name = "epicenter-works-spenden";
  buildInputs = (with pkgs; [
    php81
    php81Packages.composer
    nginx
  ]);

  shellHook = ''
    export COMPOSE_ENVIRONMENT=DEVELOPMENT
    alias php="${php}/bin/php -c ${phpIni}"
    function startServices {
      if test -f ${nginxDir}/logs/nginx.pid && ps -p $(cat ${nginxDir}/logs/nginx.pid) > /dev/null; then
        echo "NGINX already started"
      else
        echo "==============   Starting nginx..."
        ${pkgs.nginx}/bin/nginx -p ${nginxDir}/tmp  -c ${nginxConf}
      fi

      if test -f ${phpDir}/tmp/php-fpm.pid && ps -p $(cat ${phpDir}/tmp/php-fpm.pid) > /dev/null; then
        echo "PHP-FPM already started"
      else
        echo "==============   Starting phpfpm..."
        ${php}/bin/php-fpm -p ${phpDir} -y ${phpConf} -c ${phpIni}
      fi
    }
    function stopServices {
      if test -f ${nginxDir}/logs/nginx.pid && ps -p $(cat ${nginxDir}/logs/nginx.pid) > /dev/null; then
        echo "==============   Stopping nginx..."
        kill $(cat ${nginxDir}/logs/nginx.pid)
      fi
      if test -f ${phpDir}/tmp/php-fpm.pid && ps -p $(cat ${phpDir}/tmp/php-fpm.pid) > /dev/null; then
        echo "==============   Stopping phpfpm..."
        kill $(cat ${phpDir}/tmp/php-fpm.pid)
      fi
    }
  '';

}

