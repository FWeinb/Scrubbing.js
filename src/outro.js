
  Scrubbing.driver   = {
                        Mouse     : MouseDriver,
                        MouseWheel: MouseWheelDriver,

                        Touch     : TouchDriver
                       };

  Scrubbing.adapter  = { BasicNode : BasicNodeAdapter };

  Scrubbing.resolver = {
                        DefaultHorizontal  : HorizontalResolverProvider (),
                        DefaultVertical    : VerticalResolverProvider   (),

                        HorizontalProvider : HorizontalResolverProvider,
                        VerticalProvider   : VerticalResolverProvider
                      };

  window.Scrubbing = Scrubbing;

})(window);
