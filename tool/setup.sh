echo "Updating server.";
sudo apt-get update -y;

echo "Installing git.";
if [ ! -x "$(command -v git)" ]; then
	sudo apt-get install -y git;
else
	echo "git was installed";
fi

echo "Installing build-essential.";
sudo apt-get install -y build-essential;

echo "Installing nodejs.";
if [ ! -x "$(command -v node)" ]; then
	curl -O http://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz;
	tar -zxvf ~/node-v0.12.7-linux-x64.tar.gz;
	mkdir -p ~/nodejs;
	mv -n ~/node-v0.12.7-linux-x64/* ~/nodejs;
	rm -Rfv ~/node-v0.12.7-linux-x64 ~/node-v0.12.7-linux-x64.tar.gz;
else
	echo "nodejs was installed";
fi

echo "Installing mongodb.";
if [ ! -x "$(command -v mongod)" ]; then
	curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.6.9.tgz;
	tar -zxvf ~/mongodb-linux-x86_64-2.6.9.tgz;
	mkdir -p ~/mongodb;
	mv -n ~/mongodb-linux-x86_64-2.6.9/* ~/mongodb;
	rm -Rfv ~/mongodb-linux-x86_64-2.6.9 ~/mongodb-linux-x86_64-2.6.9.tgz;
else
	echo "mongod was installed";
fi

echo "export PATH=~/nodejs/bin:~/mongodb/bin:$PATH" | sudo tee -a ~/.bashrc;
source ~/.bashrc;

echo "Setting directories";
if [ ! -d ~/rental ]; then
	mkdir -p ~/rental;
else
	echo "Directory already present";
fi

if [ -d /vagrant ]; then
	rsync -av --progress --verbose /vagrant/* ~/rental/ --exclude=node_modules --exclude=bower_components
fi

cd ~/rental/

chmod uog+rwx ~/rental/tool/*.sh
