package com {

import flash.external.ExternalInterface;

public class ScriptInterface {
  public function ScriptInterface () {}
  public function camOnline () {
    ExternalInterface.call("camStatus", "online");
  }
  public function camStatus (status) {
    ExternalInterface.call("camStatus", status);
  }
  public function camOffline () {
    ExternalInterface.call("camStatus", "offline");
  }
  public function camDenied () {
    ExternalInterface.call("camStatus", "camDenied");
  }
}

}
