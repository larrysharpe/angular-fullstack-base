package com {

  import flash.external.ExternalInterface;

  public class Console {
    public function Console () {}
    public function log (content = null, alert = null) {
      trace(content);
    //  ExternalInterface.call('console.log', content);
    //  if (alert) ExternalInterface.call('alert', content);
    }
  }

}
