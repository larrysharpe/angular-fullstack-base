package com 
{
	import flash.events.Event;
	
	/**
	 * ...
	 * @author ...
	 */
	public class ConnectorEvent extends Event
	{
		public static const ON_DISCONNECT:String = "onDisconnect";
		public static const ON_SUCCESS:String = "onSuccess";
		public static const ON_FAIL:String = "onFail";
		public static const ON_REJECT:String = "onReject";
		
		public function ConnectorEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false) 
		{
			super(type, bubbles, cancelable);
			
		}
		
	}

}