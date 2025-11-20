import { createPlatePlugin } from 'platejs/react';

import { DetailsElement } from '@/components/ui/details-node';

export const DetailsPlugin = createPlatePlugin({
  key: 'details',
  node: {
    isElement: true,
    type: 'details',
    component: DetailsElement,
  },
});

