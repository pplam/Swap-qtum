rm -rf accounts && mkdir accounts

echo '=========================================[generate blocks]================================================='
docker exec swap qcli generate 600

echo '==========================================[balance before]================================================='
docker exec swap qcli getbalance

echo '==========================================[alloc accounts]================================================='
for i in {1..3}
do
  docker exec swap qcli getnewaddress > accounts/$i
  docker exec swap qcli sendtoaddress `cat accounts/$i` 100
  docker exec swap qcli gethexaddress `cat accounts/$i` >> accounts/$i
done
docker exec swap qcli listaddressgroupings

echo '==========================================[balance after]=================================================='
docker exec swap qcli getbalance
