package com {

import flash.external.ExternalInterface;
import com.Console;

public class ScriptInterface {

  var console:Console = new Console();

  public function ScriptInterface () {}
  public function camStatus (status) {
    ExternalInterface.call("camStatus",status);
  }
  public function run (funct, args = null) {
    console.log('EXT FUNC: ' + funct + ',' + args);
    ExternalInterface.call(funct, args);
  }
}

}
