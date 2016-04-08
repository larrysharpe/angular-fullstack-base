package com
{
import flash.events.Event;

/**
 * ...
 * @author ...
 */
public class ConfigEvent extends Event
{
  public static const ON_LOADSERVERCONFIG:String = "onLoadServerConfig";
  public static const ON_SERVERCONFIGLOADED:String = "onServerConfigLoaded";
  public static const ON_CONFIGLOADED:String = "onConfigLoaded";

  public function ConfigEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
  {
    super(type, bubbles, cancelable);

  }

}

}
