import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as Down } from '../../assets/Chevron_Down.svg';
import { ReactComponent as Search } from '../../assets/Search_Magnifying_Glass.svg';
import { ReactComponent as Close } from '../../assets/close-small.svg';
import { IToken } from '../../store/tokens';
import Coin from '../Coin';
import './index.scss';

const maxAmount = 1000000000;

interface IProps {
  value: number | undefined;
  onChangeValue: (value: number) => void;
  onChangeToken: (value: IToken) => void;
  token: IToken | null;
  tokens: IToken[];
  className?: string;
}

const TokenInput: React.FC<IProps> = ({ token, value, onChangeValue, onChangeToken, tokens = [], className = '' }) => {
  const selectorRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [availableTokens, setAvailableTokens] = useState(tokens);

  useEffect(() => {
    setAvailableTokens(tokens);
  }, [tokens]);

  useEffect(() => {
    // hide selector when click outside
    function handleClickOutside(event: any) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectorRef]);

  // clear search on selector close
  useEffect(() => {
    if (!showDropdown && searchRef.current?.value) {
      searchRef.current.value = '';
      setTimeout(() => {
        setAvailableTokens(tokens);
      }, 300);
    }
  }, [showDropdown, searchRef, tokens]);

  if (!token) {
    return null;
  }

  return (
    <div className={`tokens-selector-wrapper ${className}`}>
      <div className="token-input">
        <input
          className="amount-input"
          type="number"
          placeholder='0.0'
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) {
              onChangeValue(0);
            } else if (value <= maxAmount) {
              onChangeValue(value);
            }
          }}
          min={0}
          max={1000000000}
          value={value || ''}
        />
        <div className="token-selector" onClick={() => { setShowDropdown(true) }}>
          {!!token?.id && <Coin token={token.id} size={20} className="coin" />}
          <div className="">{token?.id?.toLocaleUpperCase()}</div>
          <Down className="arrow" />
        </div>
      </div>

      <div className={`tokens-selector${showDropdown ? '' : ' hidden'}`} ref={selectorRef}>
        <div className="top-input">
          <Search />
          <input
            ref={searchRef}
            type="text"
            placeholder='Search name or paste address'
            onChange={(e) => {
              const found = tokens.filter((current) => current.id.includes(e.target.value)
                || current.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()));
              setAvailableTokens(found);
            }}
            maxLength={20}
          />
          <Close onClick={() => { setShowDropdown(false) }} />
        </div>

        <div className="tokens-list">
          {availableTokens
            .filter((current) => current.id !== token?.id)
            .map((currentToken) => (
              <div
                key={currentToken.id}
                className="tokens-list__item"
                onClick={() => {
                  onChangeToken(currentToken);
                  setShowDropdown(false);
                }}
              >

                <Coin token={currentToken.id} size={20} className="coin" />
                <div>{currentToken.id.toLocaleUpperCase()}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
};

export default TokenInput;
