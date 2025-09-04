/**
 * 통합 가격 포맷팅 유틸리티
 * 중복된 가격 포맷팅 로직들을 하나로 통합
 */

export const formatPrice = (price: number): string => {
  if (!price) return '0';

  const integerPart = Math.floor(price);
  const integerDigits = integerPart.toString().length;

  if (integerDigits >= 4) {
    // 4자리 이상: 정수로 표시
    return Math.round(price).toLocaleString();
  } else if (integerDigits >= 2) {
    // 2-3자리: 소수점 1자리
    return price.toFixed(1);
  } else if (integerDigits === 1) {
    // 1자리: 소수점 2자리
    return price.toFixed(2);
  } else {
    // 1보다 작은 경우: 소수점 4자리
    return price.toFixed(4);
  }
};

export const formatPriceWithUnit = (price: number, unit: string = '원'): string => {
  return formatPrice(price) + unit;
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + '조';
  } else if (num >= 1e8) {
    return (num / 1e8).toFixed(1) + '억';
  } else if (num >= 1e4) {
    return (num / 1e4).toFixed(1) + '만';
  } else {
    return num.toLocaleString();
  }
};

export const formatPercentage = (rate: number, decimals: number = 2): string => {
  return (rate * 100).toFixed(decimals) + '%';
};

export const formatCryptoPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice) || numPrice <= 0) {
    return 'N/A';
  }

  if (numPrice >= 1) {
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (numPrice >= 0.01) {
    return numPrice.toFixed(4);
  } else if (numPrice >= 0.0001) {
    return numPrice.toFixed(6);
  } else if (numPrice >= 0.000001) {
    return numPrice.toFixed(8);
  } else if (numPrice >= 0.00000001) {
    return numPrice.toFixed(10);
  } else {
    return numPrice.toFixed(12);
  }
};