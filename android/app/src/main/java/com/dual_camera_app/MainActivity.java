package com.dual_camera_app; // this should be your package name

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // import this
import android.os.Bundle; // import this
import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
   }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Dual_Camera_App";
  }
} 
