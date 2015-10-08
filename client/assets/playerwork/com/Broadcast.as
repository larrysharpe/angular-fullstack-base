package com {

	import flash.display.MovieClip;
  import flash.external.ExternalInterface;
  import com.Connector;
  import com.Console;
  import com.Publisher;
  import com.ScriptInterface;
  import com.WebCam;
  import com.WebCamEvent;

	public class Broadcast extends MovieClip {

    var broadcaster = ExternalInterface.call("initVideoScope") || 'testing';
    var camAllowed:Boolean = false;
    var connector:Connector;
    var connectURL:String = "rtmp://localhost/videochat/";
    var console:Console = new Console();
    var browser:ScriptInterface = new ScriptInterface();
    var publisher:Publisher;
    var webcam:WebCam;

		public function Broadcast() {
      console.log(broadcaster);
      ExternalInterface.addCallback("api", api);
      if(broadcaster === 'testing') initConnector();
    }

    private function initCamera(){
      if (!webcam){
        console.log('No Camera Found');
        webcam = new WebCam();
        console.log('Camera Created');
        webcam.addEventListener(WebCamEvent.ON_CAMDENIED, onCamDenied);
        webcam.addEventListener(WebCamEvent.ON_CAMACCEPTED, onCamAccepted);
      }
      addChildAt(webcam.vid, 0);
      console.log('Camera Added to Stage');
      webcam.start();
      console.log('Camera Started');
    }

    private function removeCamera (){
      webcam.stop();
      removeChildAt(0);
      webcam = null;
      camAllowed = false;
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

    private function initPublish(){
      console.log('Starting Publish');
      console.log(connector);
      console.log(broadcaster);
      console.log(webcam);
      publisher = new Publisher(connector.nc, broadcaster, webcam);
      console.log('Publisher Created');
      publisher.addEventListener(PublisherEvent.ON_PUBLISH, onPublish);
      publisher.addEventListener(PublisherEvent.ON_UNPUBLISH, onUnPublish);
      console.log('Publisher Attempt Publish');
      publisher.publish();
    }

    function unPublish(){
      publisher.unPublish();
    }

    public function api(name:String){
      var methods =  {
        connect: initConnector,
        disconnect: unPublish
      }

      console.log(name);
      console.log('api');
      methods[name]();
    }

    /*/// EVENTS ///*/
      // Connection Events
      private function onDisconnect(e = null){
        console.log('onDisconnect');
        removeCamera();
        browser.camOffline();
      }
      private function onConnect(e = null){
        console.log('NC Connected')
        console.log('Is Cam Allowed?' + camAllowed)
        if (camAllowed)publisher.publish();
        console.log('Initiating Camera');
        initCamera();
      }
      private function onConnectFail(e = null) {}
      private function onConnectReject(e = null){}

      // Cam Events
      private function onCamDenied(e = null){
        console.log('Camera Denied');
        browser.camDenied();
      }
      private function onCamAccepted(e = null) {
        console.log('Camera Accepted');
        camAllowed = true;
        console.log('initPublish');
        initPublish();
      }

      // Publish Events
      private function onPublish(e = null) {
        browser.camOnline();
      }
      private function onUnPublish(e = null){
        console.log('onUnPublish');
        connector.disconnect();
      }
	}
}
