App.accessRule('http://localhost');

App.appendToConfig(`
  <feature name="Accelerometer">
    <param name="android-package" value="org.apache.cordova.AccelListener" />
  </feature>
`);
