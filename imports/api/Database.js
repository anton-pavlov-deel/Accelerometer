class Database {
  constructor(name='unnamed') {
    const absPath = cordova.file.externalRootDirectory;
    const fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');
    const fileName = name+'.db';
    this.path = fileDir + fileName;

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

      console.log('file system open: ' + JSON.stringify(fs));
      fs.root.getFile(this.path, { create: true, exclusive: false }, function (fileEntry) {
          console.log("fileEntry is file?" + fileEntry.isFile.toString());
          console.log(JSON.stringify(fileEntry));
      }, function (error) {
        console.log(`Error: ${JSON.stringify(error)}`);
      });
    });
  }


}

export default Database;
