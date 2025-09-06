'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated, setUser } from '@/redux/reducer/authReducer';
import SignupForm from '../signup/SignupForm';
import { loginDataFetch, responseData } from './server/loginDataFetch';
import { fetchUserInfo } from '../auth/fetchUserInfo';
import { clientEnv } from '@/utils/env';
import { FormContainer, LoginButton, GoogleLoginButton } from './style';
import { UserInfo } from '../market-selector/type';
import { useGlobalAlert } from '@/providers/AlertProvider';
interface LoginFormProps {
  closeModal: () => void;
  setModalSize: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >;
  onClickSignup?: () => void;
  hideInlineTitle?: boolean;
  hideInlineFooter?: boolean;
}

const googleLoginUrl = clientEnv.GOOGLE_LOGIN_URL;

const LoginForm: React.FC<LoginFormProps> = ({
  closeModal,
  setModalSize,
  onClickSignup,
  hideInlineTitle = false,
  hideInlineFooter = false,
}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // 전역 알림 훅
  const { showSuccess, showError } = useGlobalAlert();

  const loginUrl = clientEnv.LOGIN_URL;

  useEffect(() => {
    if (isLoginForm) {
      setModalSize({ width: 400, height: 350 });
    } else {
      setModalSize({ width: 450, height: 450 });
    }
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
  }, [isLoginForm, setModalSize]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    try {
      const loginResponse: responseData = await loginDataFetch(
        loginUrl,
        email,
        password
      );

      console.log('loginResponse', loginResponse);
      if (loginResponse) {
        if (loginResponse.result === 'success') {
          await dispatch(setIsAuthenticated());
          const userInfo = await fetchUserInfo();

          const parseUserInfo = {
            name: userInfo?.member.name,
            email: userInfo?.member.email,
            role: userInfo?.member.role,
            memberId: userInfo?.member.memberId,
          };

          if (userInfo?.isAuthenticated) {
            await dispatch(setUser(parseUserInfo));
          }
          showSuccess('로그인 성공', {
            onConfirm: () => {
              // 성공 알림 확인 후 리다이렉트
              const redirectUrl = sessionStorage.getItem('loginRedirectUrl');
              sessionStorage.removeItem('loginRedirectUrl');
              
              if (redirectUrl) {
                window.location.href = redirectUrl;
              } else {
                closeModal();
              }
            }
          });
        } else if (loginResponse.result === 'check') {
          const userConfirmed = window.confirm(
            `다른 기기에서 접속이 감지되었습니다.\n접속 IP: ${loginResponse.data}\n\n계속 진행하시겠습니까?`
          );

          if (userConfirmed) {
            await dispatch(setIsAuthenticated());
            const userInfo: UserInfo = await fetchUserInfo();

            const parseUserInfo = {
              name: userInfo?.member.name,
              email: userInfo?.member.email,
              role: userInfo?.member.role,
              memberId: userInfo?.member.memberId,
            };

            if (userInfo) {
              await dispatch(setUser(parseUserInfo));
            }
            showSuccess('로그인 성공', {
              onConfirm: () => {
                // 성공 알림 확인 후 리다이렉트
                const redirectUrl = sessionStorage.getItem('loginRedirectUrl');
                sessionStorage.removeItem('loginRedirectUrl');
                
                if (redirectUrl) {
                  window.location.href = redirectUrl;
                } else {
                  closeModal();
                }
              }
            });
          } else {
            window.location.href = '/reset-password'; // 비밀번호 재설정 페이지로 수정
          }
        }
      } else {
        showError('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      showError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = googleLoginUrl;
  };

  return (
    <FormContainer>
      {isLoginForm ? (
        <>
          {!hideInlineTitle && <h1>Login</h1>}
          <form onSubmit={handleLogin}>
            <div>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <LoginButton type="submit">로그인</LoginButton>
          </form>
          <GoogleLoginButton onClick={handleGoogleLogin}>
            <img
              src="/google.png"
              alt="google icon"
              loading="lazy"
              width="20"
              height="20"
            />
            Google로 로그인
          </GoogleLoginButton>
          <div className="remember-row">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">아이디 기억하기</label>
          </div>

          <div className="password-reset-section">
            <p>비밀번호를 잊어버리셨나요?</p>
            <button
              type="button"
              className="reset-password-btn"
              onClick={() => (window.location.href = '/reset-password')}
            >
              비밀번호 재설정
            </button>
          </div>

          {!hideInlineFooter && (
            <>
              <h1>아이디가 없으세요?</h1>
              <button
                onClick={() => {
                  if (onClickSignup) {
                    onClickSignup();
                  } else {
                    setIsLoginForm(false);
                  }
                }}
              >
                회원가입
              </button>
            </>
          )}
        </>
      ) : (
        <SignupForm setIsLoginForm={setIsLoginForm} />
      )}
    </FormContainer>
  );
};

export default LoginForm;
