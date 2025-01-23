import React, { useState } from "react";
import "./FindAccount.css";

const FindAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"id" | "pw">("id");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 탭 클릭 시 활성화 상태 변경 및 오류 초기화
  const handleTabClick = (tab: "id" | "pw") => {
    setActiveTab(tab);
    setError(null);
    setSuccessMessage(null); // 성공 메시지도 초기화
  };

  // 폼 유효성 검사 함수
  const validateForm = (formData: { email?: string; name?: string; phone?: string }) => {
    if (formData.email && !formData.email.includes("@")) {
      setError("유효한 이메일 주소를 입력하세요.");
      return false;
    }
    if (formData.name?.trim() === "") {
      setError("이름을 입력하세요.");
      return false;
    }
    if (activeTab === "pw" && (!formData.phone || formData.phone.trim() === "")) {
      setError("휴대폰 번호를 입력하세요.");
      return false;
    }
    setError(null);
    return true;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      email: (e.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value,
      name: (e.currentTarget.elements.namedItem("name") as HTMLInputElement)?.value,
      phone: (e.currentTarget.elements.namedItem("phone") as HTMLInputElement)?.value,
    };

    if (!validateForm(formData)) {
      return;
    }

    try {
      let endpoint = "";
      const requestBody: { name: string; email?: string; phone?: string } = {
        name: formData.name!,
      };

      if (activeTab === "id") {
        endpoint = "/api/users/recoverId";
        requestBody.email = formData.email;
      } else {
        endpoint = "/api/users/resetPassword";
        requestBody.email = formData.email;
        requestBody.phone = formData.phone;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("요청 처리 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setSuccessMessage(data.message || "요청이 성공적으로 처리되었습니다.");
    } catch (err: any) {
      setError(err.message || "요청 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="find-container">
      <h1 className="find-title">아이디/비밀번호 찾기</h1>
      <div className="find-tabs">
        <button
          className={`find-tab ${activeTab === "id" ? "active" : ""}`}
          onClick={() => handleTabClick("id")}
        >
          아이디 찾기
        </button>
        <button
          className={`find-tab ${activeTab === "pw" ? "active" : ""}`}
          onClick={() => handleTabClick("pw")}
        >
          비밀번호 찾기
        </button>
      </div>
      {error && <div className="find-error">{error}</div>}
      {successMessage && <div className="find-success">{successMessage}</div>}
      {activeTab === "id" ? (
        <form className="find-form" onSubmit={handleSubmit}>
          <label className="find-label">
            이름
            <input name="name" type="text" className="find-input" placeholder="이름을 입력하세요" required />
          </label>
          <label className="find-label">
            이메일 주소
            <input name="email" type="email" className="find-input" placeholder="이메일 주소를 입력하세요" required />
          </label>
          <button type="submit" className="find-button">
            아이디 찾기
          </button>
        </form>
      ) : (
        <form className="find-form" onSubmit={handleSubmit}>
          <label className="find-label">
            이름
            <input name="name" type="text" className="find-input" placeholder="이름을 입력하세요" required />
          </label>
          <label className="find-label">
            아이디(이메일)
            <input name="email" type="email" className="find-input" placeholder="아이디(이메일)을 입력하세요" required />
          </label>
          <label className="find-label">
            휴대폰 번호
            <input name="phone" type="text" className="find-input" placeholder="휴대폰 번호를 입력하세요" required />
          </label>
          <button type="submit" className="find-button">
            비밀번호 찾기
          </button>
        </form>
      )}
      <div className="find-footer">
        <a href="/login" className="find-link">로그인하기</a>
        <span className="find-divider">|</span>
        <a href="/signup" className="find-link">회원가입</a>
      </div>
    </div>
  );
};

export default FindAccount;
