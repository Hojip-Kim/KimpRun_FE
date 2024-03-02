import React from 'react';
function App() {
  // <---- 자바스크립트 영역 ---->
  const handleClick = () => {
    alert('경고창입니다');
  };
  return (
    /* <---- HTML/JSX 영역  ---->*/
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 이곳에 퀴즈를 위한 html 코드를 작성해 주세요 */}
      <a>이것은 내가 만든 App컴포넌트입니다.</a>
      <button onClick={handleClick}>클릭!</button>
    </div>
  );
}

export default App;

// function App() {

//   const handleClick = () => {
//     alert('클릭!');
//   };

//   return (
//     <div
//       style={{
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       <span>이것은 내가 만든 App컴포넌트 입니다</span>
//       <button onClick={handleClick}>클릭!</button>
//     </div>
//   );
// }

// export default App;
