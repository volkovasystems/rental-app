echo "Recopying changes from the main folder"
rsync -av --progress --verbose /vagrant/* ~/parq/ --exclude=node_modules --exclude=bower_components
