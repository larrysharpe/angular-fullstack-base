package com 
{
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Larry Sharpe
	 */
	public class WebCamEvent extends Event 
	{
		public static const ON_CAMDENIED:String = "onCamDenied";
		public static const ON_CAMACCEPTED:String = "onCamAccepted";
		
		public function WebCamEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false) 
		{
			super(type, bubbles, cancelable);		
		}
		
	}

}