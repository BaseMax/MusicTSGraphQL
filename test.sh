#!/bin/sh
# author: https://blog.harrison.dev/2016/06/19/integration-testing-with-docker compose.html
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
cleanup () {
  docker compose -p ci kill
  docker compose -p ci rm -f
}
trap 'cleanup ; printf "${RED}Tests Failed For Unexpected Reasons${NC}\n"' HUP INT QUIT PIPE TERM
docker compose -p ci -f docker-compose.base-dev.yml -f docker-compose.test.yml up -d --build
if [ $? -ne 0 ] ; then
  printf "${RED}Docker Compose Failed${NC}\n"
  exit -1
fi
TEST_EXIT_CODE=`docker wait ci-app-1`
docker logs ci-app-1
if [ -z ${TEST_EXIT_CODE+x} ] || [ "$TEST_EXIT_CODE" -ne 0 ] ; then
  printf "${RED}Tests Failed${NC} - Exit Code: $TEST_EXIT_CODE\n"
else
  printf "${GREEN}Tests Passed${NC}\n"
fi
cleanup
exit $TEST_EXIT_CODE
