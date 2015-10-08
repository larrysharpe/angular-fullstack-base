package com {

import flash.external.ExternalInterface;

public class ScriptInterface {
  public function ScriptInterface () {}
  public function camOnline () {
    ExternalInterface.call("camStatus", "online");
  }
  public function camOffline () {
    ExternalInterface.call("camStatus", "offline");
  }
  public function camDenied () {
    ExternalInterface.call("camStatus", "camDenied");
  }
}

}
