package com {

	import flash.display.MovieClip;
  import flash.external.ExternalInterface;
  import flash.media.Video;
  import com.Connector;
  import com.Console;
  import com.Publisher;
  import com.ScriptInterface;
  import com.Subscribe;
  import com.WebCam;
  import com.WebCamEvent;

	public class Watch extends MovieClip {

    var config = ExternalInterface.call("initVideoConfig");
    var broadcaster = (config && config.broadcaster) ? config.broadcaster : 'testing';
    var connector:Connector;
    var connectURL:String;
    var console:Console = new Console();
    var browser:ScriptInterface = new ScriptInterface();
    var sub:Subscribe;
    var video:Video = new Video();
    var streamInstance:String;
    var show:String;

		public function Watch() {
      console.log('Watch Initial Config:');
      console.log(this.config);

      if(!this.config) {
        this.config = {
          broadcaster: 'testing',
          server: { dev: 'rtmp://localhost/videochat/'},
          env: 'dev',
          show: 'public'
        }
      }

      console.log('Watch Final Config');
      console.log(this.config);

      ExternalInterface.addCallback("api", api);
      initConnector();
    }


    private function initConnector(){
      if(connector){
        console.log('Undoing Connector');
        connector.disconnect();
        console.log('Nulling Connector');
        connector = null;
      }

      this.connectURL = this.config.server[this.config.env] + '/' + this.config.broadcaster

      console.log('Creating Connector::: ' + connectURL);
      connector = new Connector(connectURL);
      connector.addEventListener(ConnectorEvent.ON_DISCONNECT, onDisconnect);
      connector.addEventListener(ConnectorEvent.ON_SUCCESS, onConnect);
      connector.addEventListener(ConnectorEvent.ON_FAIL, onConnectFail);
      connector.addEventListener(ConnectorEvent.ON_REJECT, onConnectReject);
      connector.connect();
    }

    public function addVideo (){
      video.attachNetStream(sub.ns);
      console.log('Add Video')
      addChildAt(video, 0);
    }


    public function api(obj){

      console.log('API CALLED FROM WATCH')
      console.log(config);
      console.log(obj);

      var methods =  {
        connect: initConnector
      }

      console.log('flash api call:' + obj);
      console.log('api');
      if (obj && obj.show) this.show = obj.show;
      methods[obj.method]();
    }

    /*/// EVENTS ///*/
      // Connection Events
      private function onDisconnect(e = null){
        console.log('onDisconnect');
      }
      private function onConnect(e = null){
        console.log('NC Connected');

        this.streamInstance = this.config.broadcaster + '-' +this.config.show;

        sub = new Subscribe(connector.nc, this.streamInstance);
        sub.addEventListener(SubscribeEvent.ON_STREAMPUBLISHNOTIFY, onStreamPublishNotify);
        sub.addEventListener(SubscribeEvent.ON_STREAMRESET, onStreamReset);
        sub.addEventListener(SubscribeEvent.ON_STREAMPLAYING, onStreamPlaying);
        sub.addEventListener(SubscribeEvent.ON_STREAMSTOPPED, onStreamStopped);
        sub.addEventListener(SubscribeEvent.ON_STREAMNOTFOUND, onStreamNotFound);
        sub.addEventListener(SubscribeEvent.ON_STREAMUNKNOWN, onStreamUnknown);

        addVideo();
      }

    private function onStreamPublishNotify (e = null){}
    private function onStreamReset (e = null) {}
    private function onStreamPlaying (e = null) {
      browser.run('streamPlaying');
    }
    private function onStreamStopped (e = null)  {
      browser.run('streamNotPlaying');
    }
    private function onStreamNotFound (e = null) {
      browser.run('streamNotPlaying');
    }
    private function onStreamUnknown (e = null)   {
      browser.run('streamNotPlaying');
    }
    private function onConnectFail(e = null)   {
      browser.run('streamNotPlaying');
    }
    private function onConnectReject(e = null)  {
      browser.run('streamNotPlaying');
    }

  }
}
