import { useState, useEffect } from 'react';
import { mockPredictions } from '../mock/predictions';

export const usePredictions = () => {
  const [predictions, setPredictions] = useState(mockPredictions);
  const [isLoading, setIsLoading] = useState(false);

  return {
    predictions,
    isLoading,
    refreshPredictions: () => setPredictions([...mockPredictions]),
  };
};

export default usePredictions;
