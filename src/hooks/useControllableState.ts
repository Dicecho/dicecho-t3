import { useState } from "react";

import type { Dispatch, SetStateAction } from "react";

export const useControllableState = <S>(
  initialState: S,
  state?: S,
  setState?: (state: S) => void,
): [S, Dispatch<SetStateAction<S>>] => {
  const [_state, _setState] = useState<S>(initialState);

  const dispatcher: Dispatch<SetStateAction<S>> = (v) => {
    if (setState !== undefined) {
      if (typeof v !== "function") {
        return setState(v);
        
      }

      return setState((v as (prevState: S) => S)(state ?? _state));
    }

    return _setState(v);
  }

  return [
    state ?? _state,
    dispatcher
  ];
};
