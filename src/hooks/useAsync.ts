/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { IStatus } from '../types/promise.types';
import { DEFINE_STATUS } from '../constants/promise';

interface IOptions {
  dependencies?: any[];
  immediate?: boolean;
}

type IError = any;

interface IReturnData<T> {
  status: IStatus;
  loading: boolean;
  data: T | null | IError;
}

type IReturn<T> = [IReturnData<T>, () => void];

const useAsync = <T>(
  asyncFunction: () => Promise<any>,
  options: IOptions = {},
): IReturn<T> => {
  const { dependencies = [], immediate = false } = options;

  const [state, setState] = useState<IReturnData<T>>({
    status: DEFINE_STATUS.IDLE,
    loading: false,
    data: null,
  });

  const [isFirstCall, setIsFirstCall] = useState<boolean>(false);

  const onResetState = () => {
    setState({
      status: DEFINE_STATUS.IDLE,
      loading: false,
      data: null,
    });
  };

  const onSetStatePending = () => {
    setState({
      status: DEFINE_STATUS.PENDING,
      loading: true,
      data: null,
    });
  };

  const onSetDataState = (data: T) => {
    setState({
      data,
      loading: false,
      status: DEFINE_STATUS.SUCCESS,
    });
  };

  const callbackMemoized = useCallback(async () => {
    onResetState();
    try {
      onSetStatePending();
      const rs = await asyncFunction();
      onSetDataState(rs as T);
    } catch (error) {
      onSetDataState(error as IError);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate || isFirstCall) callbackMemoized();
    setIsFirstCall(true);
  }, dependencies);

  return [
    {
      ...state,
    },
    callbackMemoized,
  ];
};

export default useAsync;
