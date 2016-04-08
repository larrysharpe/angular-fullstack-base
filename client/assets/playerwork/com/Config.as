package com {

import com.ConfigEvent;
import com.Console;

import flash.events.Event;
  import flash.events.EventDispatcher;
  import flash.external.ExternalInterface;
  import flash.net.URLLoader;
  import flash.net.URLRequest;

  public class Config extends EventDispatcher {

    var pageConfigLoaded:Boolean = false;
    var serverConfigLoaded:Boolean = false;
    var serverConfigURL:String = 'http://localhost:9000/streamconfig';
    var settings:Object = {};
    var testSettings = {
      broadcaster: 'johnny-test',
      instanceType: 'public',
      server: 'rtmp://localhost/videochat/'
    };
    var console:Console = new Console();


    public function Config () {
      this.loadPageConfig();
      this.loadServerConfig();
    }

    public function getConfig () {
      return this.settings;
    }

    private function loadPageConfig () {
      dispatchEvent(new ConfigEvent('onLoadPageConfig'));
      var config = ExternalInterface.call("initVideoConfig");
      if (config) {
        if (config.broadcaster) this.settings.broadcaster = config.broadcaster;
        if (config.instanceType) this.settings.instanceType = config.instanceType;
      } else {
        dispatchEvent(new ConfigEvent('onLoadPageError'));
      }

      console.log('New Config');
      console.log(config);
      console.log('-----');
      console.log(this.settings);

      if(!this.settings.broadcaster) this.settings.broadcaster = this.testSettings.broadcaster;
      if(!this.settings.instanceType) this.settings.instanceType = this.testSettings.instanceType;

      console.log('Page Config Loaded: ')
      console.log(this.settings);
      this.pageConfigLoaded = true;
      if (this.serverConfigLoaded) dispatchEvent(new ConfigEvent('onConfigLoaded'));
    };

    private function loadServerConfig () {
      dispatchEvent(new ConfigEvent('onLoadServerConfig'));
      var loader:URLLoader = new URLLoader();
      var request:URLRequest = new URLRequest();
      request.url = this.serverConfigURL;
      loader.addEventListener(Event.COMPLETE, onLoaderComplete)
      loader.load(request);
    }

    private function onLoaderComplete (e:Event):void{

      var loader:URLLoader = URLLoader(e.target);
      settings.server = loader.data;
      dispatchEvent(new ConfigEvent('onServerConfigLoaded'));
      this.serverConfigLoaded = true;
      if (this.pageConfigLoaded) dispatchEvent(new ConfigEvent('onConfigLoaded'));
    }

  }

}
