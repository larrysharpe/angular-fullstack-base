package com
{
import flash.events.Event;

/**
 * ...
 * @author Larry Sharpe
 */
public class SubscribeEvent extends Event
{
  public static const ON_STREAMPUBLISHNOTIFY:String = 'onStreamPublishNotify';
  public static const ON_STREAMRESET:String = 'onStreamReset';
  public static const ON_STREAMPLAYING:String = 'onStreamPlaying';
  public static const ON_STREAMSTOPPED:String = 'onStreamStopped';
  public static const ON_STREAMNOTFOUND:String = 'onStreamNotFound';
  public static const ON_STREAMUNKNOWN:String = 'onStreamUnknown';


  public function SubscribeEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
  {
    super(type, bubbles, cancelable);
  }

}

}
