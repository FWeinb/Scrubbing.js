
  Scrubber.driver   = {
                        Mouse     : MouseDriver,
                        MouseWheel: MouseWheelDriver
                       };

  Scrubber.adapter  = { BasicNode : BasicNodeAdapter };

  Scrubber.resolver = {
                        DefaultHorizontal  : HorizontalResolverProvider (),
                        DefaultVertical    : VerticalResolverProvider   (),

                        HorizontalProvider : HorizontalResolverProvider,
                        VerticalProvider   : VerticalResolverProvider
                      };

  window.Scrubber = Scrubber;

})(window);
