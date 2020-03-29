#!/bin/bash

exec_sql() {
  return $(mysql -h "127.0.0.1" -P 3306 --password="password" -u "root" --raw --batch -s -e "${1}" >> /dev/null 2>&1)
}

bold=$(tput bold)
normal=$(tput sgr0)

echo " ---------------------------------------------- "
echo " ${bold}Booting Elemental...${normal}"
echo " "

docker-compose pull > /dev/null 2>&1

echo " Images: ${bold}downloaded${normal}"

docker-compose up core_services > /dev/null 2>&1

echo " Core services: ${bold}booted${normal}"

exec_sql "CREATE DATABASE IF NOT EXISTS db" > /dev/null 2>&1
echo " Database: ${bold}created${normal}"

docker-compose up -d elemental > /dev/null 2>&1

sleep 10;

echo " Elemental: ${bold}booted${normal}"

xdg-open http://admin.elementalsystem.org > /dev/null 2>&1

echo " ---------------------------------------------- "
echo " Your browser should have automatically opened"
echo " and you should see a login prompt."
echo " "
echo " Login using the following credentials:"
echo " "
echo " Username: ${bold}admin@elementalsystem.org${normal}"
echo " Password: ${bold}Password1!${normal}"
echo " "
echo " If you do not see this prompt open:"
echo " "
echo " ${bold}http://admin.elementalsystem.org${normal}"
echo " "
echo " To access emails sent by the system open:"
echo " "
echo " http://localhost:8025"
echo " ---------------------------------------------- "