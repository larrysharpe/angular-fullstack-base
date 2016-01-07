package com {

import flash.external.ExternalInterface;

public class ScriptInterface {
  public function ScriptInterface () {}
  public function camStatus (status) {
    ExternalInterface.call("camStatus",status);
  }
}

}
