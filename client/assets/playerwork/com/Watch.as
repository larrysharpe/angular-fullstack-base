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

    var broadcaster = ExternalInterface.call("initVideoScope") || 'testing';
    var connector:Connector;
    //var connectURL:String = "rtmp://localhost/videochat/";
    var connectURL:String = "rtmp://52.90.74.122:1935/videochat";
    var console:Console = new Console();
    var browser:ScriptInterface = new ScriptInterface();
    var sub:Subscribe;
    var video:Video = new Video();

		public function Watch() {
      console.log(broadcaster);
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

      console.log('Creating Connector');
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


    public function api(name:String){
      var methods =  {
        connect: initConnector
      }

      console.log(name);
      console.log('api');
      methods[name]();
    }

    /*/// EVENTS ///*/
      // Connection Events
      private function onDisconnect(e = null){
        console.log('onDisconnect');
      }
      private function onConnect(e = null){
        console.log('NC Connected');
        sub = new Subscribe(connector.nc, broadcaster);
        addVideo();
      }
      private function onConnectFail(e = null) {}
      private function onConnectReject(e = null){}

	}
}
