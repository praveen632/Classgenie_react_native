package com.classgenie;
import android.app.Application;
import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.wonday.pdf.RCTPdfView;
import com.github.reactNativeMPAndroidChart.MPAndroidChartPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;; // Import package

import cl.json.RNSharePackage;
import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
   return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SplashScreenReactPackage(),
            new RCTPdfView(),
           new RNFetchBlobPackage(),
            new ReactNativeDocumentPicker(),
		  new ImagePickerPackage(),
		  new FIRMessagingPackage(),
            new MPAndroidChartPackage(),
            new ReactVideoPackage(),
			 new RNSharePackage() 
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
   @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

 }
