package com 
{
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Larry Sharpe
	 */
	public class PublisherEvent extends Event 
	{
		public static const ON_PUBLISH:String = "onPublish";
		public static const ON_UNPUBLISH:String = "onUnPublish";
		
		public function PublisherEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false) 
		{
			super(type, bubbles, cancelable);		
		}
		
	}

}