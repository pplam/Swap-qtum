# Swap@qtum
ATN cross chain swap router at qtum
## Installation
Make sure docker is avaliable and the qtum image has been pulled
~~~shell
git clone https://github.com/ATNIO/Swap-qtum.git
cd Swap-qtum
npm install
~~~
## Deployment
~~~shell
./bin/qtumd && make
~~~
## Usage
Setup a demo with
~~~shell
make demo
~~~
then listen atn events by
~~~shell
npm run listenatn
~~~
and swap events by
~~~shell
npm run listenatn
~~~
Now launch another shell and
~~~shell
./bin/swap <from> <fromHex> <to_chain> <to_address> <amount>
~~~
