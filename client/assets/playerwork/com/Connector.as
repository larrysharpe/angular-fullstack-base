package com
{
  import com.Console;
	import flash.events.EventDispatcher;
	import flash.events.Event;
	import flash.events.NetStatusEvent;
	import flash.net.NetConnection;
	/**
	 * ...
	 * @author Larry Sharpe
	 */
	public class Connector extends EventDispatcher
	{

		var nc:NetConnection;
		var connected:Boolean = false;
		var connectURL:String;
    var console:Console = new Console();

		public function Connector(connectURL){
			this.connectURL = connectURL;
		}

		public function disconnect(e = null){
      console.log('NC Close');
      if(nc) nc.close();
      console.log('NC Null');
      nc = null;
			connected = false;
			dispatchEvent(new ConnectorEvent('onDisconnect'));
		}

		public function connect(e = null){
			if (!connected) {
        console.log('Creating New Connection');
				nc = new NetConnection();
				nc.connect(this.connectURL);
				nc.addEventListener(NetStatusEvent.NET_STATUS, ncOnStatus);
			} else {
				dispatchEvent(new ConnectorEvent('onSuccess'));
			}
		}

		public function ncOnStatus(infoObject:NetStatusEvent){
      var info = "nc: " + infoObject.info.code + " (" + infoObject.info.description + ")";
      console.log(info);

      if (infoObject.info.code == "NetConnection.Connect.Success") {
				connected = true;
				dispatchEvent(new ConnectorEvent('onSuccess'));
			}
			else if (infoObject.info.code == "NetConnection.Connect.Failed"){
				console.log("Connection failed: tried connectiong to: "+this.connectURL+",  Try rtmp://[server-ip-address]/videochat");
				connected = false;
				dispatchEvent(new ConnectorEvent('onFail'));
			}
			else if (infoObject.info.code == "NetConnection.Connect.Rejected"){
				console.log(infoObject.info.description);
				connected = false;
				dispatchEvent(new ConnectorEvent('onReject'));
			}
		}

	}

}
