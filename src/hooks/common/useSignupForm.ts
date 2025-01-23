import { useState } from "react";
import { RegisterUserRequest } from "../../types/api/user";

export const useSignupForm = () => {
  const [formData, setFormData] = useState<
    RegisterUserRequest & { confirmPassword: string }
  >({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 아이디 변경 시 중복 확인 초기화
    if (name === 'username') {
      setIsUsernameChecked(false);
    }

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.username) {
      newErrors.username = '아이디는 필수 입력 사항입니다.';
    } else if (!canUsername(formData.username)) {
      newErrors.username = '아이디는 6-12자의 영문, 숫자, 기호( - _ )만 사용이 가능합니다.';
    } else if (!isUsernameChecked) {
      newErrors.username = '아이디 중복 확인을 해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호는 필수 입력 사항입니다.';
    } else if (!canPassword(formData.password)) {
      newErrors.password = '비밀번호는 반드시 8-20자 이내 숫자, 특수문자, 영문자 중 2가지 이상을 조합해야합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 재입력해 입력 사항을 확인해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다. 내용을 확인해주세요.'
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password && !newErrors.confirmPassword
  }

  // 아이디 검증: 6-12자의 영문으로 시작하고, 영문/숫자/-/_ 조합
  function canUsername(username: string) {
    const regExp = /^[a-zA-Z][a-zA-Z0-9-_]{5,11}$/;
    return regExp.test(username);
  }

  // 비밀번호 검증: 8-20자, 영문/숫자/특수문자 중 2가지 이상 조합
  function canPassword(password: string) {
    // 길이 체크
    if (password.length < 8 || password.length > 20) return false;

    let containsLetter = /[a-zA-Z]/.test(password);
    let containsNumber = /[0-9]/.test(password);
    let containsSpecial = /[!@#$%^&*]/.test(password);

    // 2가지 이상 조합 체크
    let combinationCount = 0;
    if (containsLetter) combinationCount++;
    if (containsNumber) combinationCount++;
    if (containsSpecial) combinationCount++;

    return combinationCount >= 2;
  }

  return {
    formData,
    errors,
    setErrors,
    isUsernameChecked,
    setIsUsernameChecked,
    handleChange,
    validateForm,
  };
}