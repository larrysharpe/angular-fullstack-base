package com {

  import flash.net.NetConnection;
	import flash.events.NetStatusEvent;
	import flash.net.NetStream;
	import flash.events.EventDispatcher;
	import flash.events.Event;
	import com.Connector;
  import com.Console;


	/**
	 * ...
	 * @author Larry Sharpe
	 */
	public class Publisher extends EventDispatcher{

    var broadcaster;
    var camera;
		var connection:NetConnection;
    var console:Console = new Console();
    var microphone
		var stream:NetStream;

		public function Publisher(connection, broadcaster, webcam) {
			if (connection) this.connection = connection;
      if (broadcaster) this.broadcaster = broadcaster;
			if (webcam.camera) this.camera = webcam.camera;
			if (webcam.microphone) this.microphone = webcam.microphone;
		}

		public function publish() {
      if (stream) {
        stream = null;
      }
      console.log('Publish Attempt');
			stream = new NetStream(connection);
      console.log('Publish NetStream Created');
			stream.addEventListener(NetStatusEvent.NET_STATUS, nsPublishOnStatus);
			stream.bufferTime = 0; // set the buffer time to zero since it is chat
			stream.publish(broadcaster); // publish the stream by name
      console.log('Publish Command Created');
			stream.attachCamera(camera);
      console.log('Attach Camera');
			stream.attachAudio(microphone);
      console.log('Attach Mic');
		}

		public function unPublish(e = null) {
			stream.attachCamera(null);
			stream.attachAudio(null);
			stream.publish("null");
			stream.close();
      console.log('Null Stream');
      //stream = null;
		}

		private function nsPublishOnStatus(infoObject:NetStatusEvent)
		{
      var info = "nsPublish: "+infoObject.info.code+" ("+infoObject.info.description+")";
			console.log(info);
			if (infoObject.info.code == "NetStream.Publish.Start") {  trace('Publishing');
				dispatchEvent(new PublisherEvent('onPublish'));
			}
			if (infoObject.info.code == "NetStream.Unpublish.Success") {  trace('Not Publishing');
				dispatchEvent(new PublisherEvent('onUnPublish'));
			}

			if (infoObject.info.code == "NetStream.Play.StreamNotFound") {}
			if (infoObject.info.code == "NetStream.Play.Failed") trace(infoObject.info.description);
		}
	}
}
