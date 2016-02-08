package com {

  import flash.display.LoaderInfo;
	import flash.display.MovieClip;
  import flash.external.ExternalInterface;
  import com.Connector;
  import com.Console;
  import com.Publisher;
  import com.ScriptInterface;
  import com.WebCam;
  import com.WebCamEvent;

	public class Broadcast extends MovieClip {
    var config = ExternalInterface.call("initVideoConfig");
    var broadcaster = (config && config.broadcaster) ? config.broadcaster : 'testing';
    var camAllowed:Boolean = false;
    var connector:Connector;
    var connectURL:String = (config && config.broadcaster) ? config.streamServer : 'rtmp://localhost/videochat/';
    var console:Console = new Console();
    var browser:ScriptInterface = new ScriptInterface();
    var publisher:Publisher;
    var webcam:WebCam;
    var settings:Object;
    var changingConnection:String = null;
    var show:String = null;
    var streamInstance:String;


    public function Broadcast() {

      console.log('Broadcast Initial Config:');
      console.log(this.config);

      if(!this.config) {
        this.config = {
          broadcaster: 'testing',
          server: { dev: 'rtmp://localhost/videochat/'},
          env: 'dev',
          show: 'public'
        }
      }

      console.log('Broadcast Final Config');
      console.log(this.config);

      ExternalInterface.addCallback("api", api);
      if(broadcaster === 'testing') initConnector();

    }
    private function initConnector(e = null){
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


    private function loadSettings(){
      console.log('--- Load Settings Called ---');
      settings = ExternalInterface.call('initVideoConfig');
      console.log('--- Load Settings Called ---');
    };

    private function initPublish(){
      console.log('Starting Publish');
      console.log('connector: '+ connector);
      console.log('instance:' +  broadcaster);
      console.log('webcam:' + webcam);

      this.streamInstance = this.config.broadcaster + '-' +this.config.show;

      publisher = new Publisher(connector.nc, this.streamInstance, webcam);
      console.log('Publisher Created');
      publisher.addEventListener(PublisherEvent.ON_PUBLISH, onPublish);
      publisher.addEventListener(PublisherEvent.ON_UNPUBLISH, onUnPublish);
      console.log('Publisher Attempt Publish');
      publisher.publish();
    }

    private function unPublish(){
      publisher.unPublish();
    }

    private function changePublish (){
      publisher.unPublish();
      console.log('**** obj instance ****');
    }


    public function api(obj){
      var methods =  {
        connect: initConnector,
        disconnect: unPublish,
        loadSettings: loadSettings,
        changePublish: changePublish
      }

      console.log('flash api call:' + obj);
      console.log('api: ' + obj.method);
      console.log('show: ' + obj.show);
      if(obj.method === 'changePublish' && obj.instance) this.changingConnection = obj.instance;
      if (obj.show) this.show = obj.show;

      methods[obj.method]();
    }

    /*/// EVENTS ///*/
      // Connection Events
      private function onDisconnect(e = null){
        console.log('onDisconnect');

        console.log('oooooooo ----- ooooooo');
        console.log(this.changingConnection);

        if (this.changingConnection){
          this.broadcaster = this.changingConnection;
          this.changingConnection = null;
          this.initConnector();
        } else {
          removeCamera();
          browser.camStatus("offline");
        }


      }
      private function onConnect(e = null){
        console.log('NC Connected');
        console.log('Is Cam Allowed?' + camAllowed);
        if (camAllowed)publisher.publish();
        console.log('Initiating Camera');
        initCamera();
      }
      private function onConnectFail(e = null) {
        console.log('Connection Failed');
        browser.camStatus('connectionFailed');
      }
      private function onConnectReject(e = null){
        console.log('Connection Rejected');
        browser.camStatus('connectionRejected');
      }

      // Cam Events
      private function onCamDenied(e = null){
        console.log('Camera Denied');
        browser.camStatus('camDenied');
      }
      private function onCamAccepted(e = null) {
        console.log('Camera Accepted');
        camAllowed = true;
        console.log('initPublish');
        initPublish();
      }

      // Publish Events
      private function onPublish(e = null) {
        browser.camStatus(this.show);
      }
      private function onUnPublish(e = null){
        console.log('onUnPublish');
        connector.disconnect();
      }
	}
}
