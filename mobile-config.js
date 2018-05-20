App.accessRule('http://localhost:12240/');
App.accessRule('http://localhost:3000/');
App.accessRule('http://localhost:12240/', { type: 'navigation' });
App.accessRule('http://localhost/');

App.setPreference("AndroidPersistentFileLocation", "Compatibility");
App.setPreference("AndroidExtraFilesystems", "files, cache, sdcard, cache-external, files-external");

App.info({
  id: 'com.meteor.AandA.accelerometer',
  name: 'Accelerometer',
  version: '0.0.1',
});

App.appendToConfig(`
  <feature name="Accelerometer">
    <param name="android-package" value="org.apache.cordova.AccelListener" />
  </feature>
`);
