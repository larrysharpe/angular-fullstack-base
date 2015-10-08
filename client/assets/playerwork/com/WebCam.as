package com
{

	import flash.events.EventDispatcher;
	import flash.events.StatusEvent;
	import flash.media.Camera;
	import flash.media.Microphone;
	import flash.media.Video;
  import com.Console;

	/**
	 * ...
	 * @author Larry Sharpe
	 */
	public class WebCam extends EventDispatcher	{
		var camera:Camera;
		var camAllowed:Boolean = false;
    var console:Console = new Console();
		var microphone:Microphone;
		var vid:Video = new Video;

		public function WebCam(){}

		function start(){

      console.log('Starting Camera');
			vid.clear();

			// get the default Flash camera and microphone
			camera = Camera.getCamera();

      microphone = Microphone.getMicrophone();
      console.log('Cam and Mic Attached');

			vid.attachCamera(camera);

			if (camera != null) {
        console.log('Camera Exists');
        if (camera.muted){
          camera.addEventListener(StatusEvent.STATUS, handleCameraStatus, false, 0, true);
          console.log('Camera is Muted');
      }else{
          console.log('Camera is  not Muted');
					camera.setMode(240, 180, 15, false);
					camera.setQuality(0, 100);
					camera.setKeyFrameInterval(30);
          dispatchEvent(new WebCamEvent('onCamAccepted'));
        }
			}

			if (microphone != null)
			{
        console.log('Mic Exists');
				microphone.rate = 11;
				microphone.setSilenceLevel(0);
			}
		}

		function stop() {
		   vid.attachCamera(null);
		   vid.clear();
		}

		private function handleCameraStatus(e:StatusEvent):void
		{

      console.log('Camera Status: ' + e.code);


      switch (e.code)
			{
				case 'Camera.Muted':
				{
					camAllowed = false;
					dispatchEvent(new WebCamEvent('onCamDenied'));
					break;
				}
				case 'Camera.Unmuted':
				{
					camAllowed = true;
					start();
					break;
				}
			}
		}

	}

}
