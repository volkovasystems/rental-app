Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", ip: "192.168.123.123"

  config.vm.provider :virtualbox do |box|
    box.name = "rental"
    box.customize [ "modifyvm", :id, "--natdnshostresolver1", "on" ]
  end

  config.vm.provision "setup", 
    run: "once",
    privileged: false,
    type: "shell" do |script|
    script.path = "./tool/setup.sh"
  end
end
