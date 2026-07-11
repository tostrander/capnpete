const prices={"Sunset Cruise":100,"Warm Beach Outing":150,"Trip to Allyn":200,"Harstine Island Hiking Trip":150,"Custom Trip":0};
const extraHourTrips=new Set(["Warm Beach Outing","Harstine Island Hiking Trip"]);
const $=id=>document.getElementById(id);
function getAmount() {
    const trip = $("excursion").value;
    const base = prices[trip] || 0;
    const extraHours = Math.max(
      0,
      Number($("additionalHours").value) || 0
    );
  
    const calculated =
      trip === "Custom Trip"
        ? base
        : base + extraHours * 50;
  
    if ($("useCustomAmount").checked) {
      return Math.max(
        0,
        Number($("customAmount").value) || 0
      );
    }
  
    return calculated;
  }
function updateAmount(){const amount=getAmount();$("amountDisplay").textContent=amount.toLocaleString("en-US",{style:"currency",currency:"USD"});return amount}
function fmtDate(v){if(!v)return"[DATE]";return new Date(v+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
function fmtTime(v){if(!v)return"[TIME]";const [h,m]=v.split(":");const d=new Date();d.setHours(Number(h),Number(m),0,0);return d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}
function buildEmail(){const amount=updateAmount(),amountText=amount.toLocaleString("en-US",{style:"currency",currency:"USD"}),name=$("customerName").value.trim()||"[CUSTOMER NAME]",trip=$("excursion").value,date=fmtDate($("tripDate").value),time=fmtTime($("tripTime").value),guests=$("guestCount").value,phone=$("customerPhone").value.trim(),notes=$("customerNotes").value.trim(),meeting=$("meetingInstructions").value.trim()||"Please meet at Herron Island North Beach 10 minutes before departure.",sender=$("senderName").value.trim()||"Pete",bizPhone=$("businessPhone").value.trim(),url="https://www.paypal.com/ncp/payment/SWPHT2MQ7J9YS";
const subject=`Cap'n Pete reservation: ${trip} on ${date}`;const lines=[`Hi ${name},`,"","Thanks for choosing Cap'n Pete Boat Excursions!","","Here are the details for your reservation:","",`Trip: ${trip}`,`Date: ${date}`,`Departure time: ${time}`,`Guests: ${guests}`,"Meeting location: Herron Island North Beach"];if(phone)lines.push(`Phone: ${phone}`);if(notes)lines.push("","Notes:",notes);lines.push("",`Total due: ${amountText}`,"","Please use the secure PayPal payment link below:",url,"",`When prompted, enter ${amountText} as the payment amount.`,"","Your reservation is confirmed once payment has been received.","",meeting,"","Life jackets are provided. You are welcome to bring food and alcoholic or non-alcoholic drinks aboard.","","Thanks! We look forward to seeing you on the water.","",sender,"Cap'n Pete Boat Excursions");if(bizPhone)lines.push(bizPhone);lines.push("info@capnpete.com","capnpete.com");const msg=lines.join("\n");$("subjectOutput").value=subject;$("emailOutput").textContent=msg;$("openEmailButton").href=`mailto:${encodeURIComponent($("customerEmail").value.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;$("status").textContent="Email generated."}
async function copyText(t,msg){try{await navigator.clipboard.writeText(t);$("status").textContent=msg}catch(e){$("status").textContent="Copying was blocked. Select and copy manually."}}
function resetForm(){["customerName","customerEmail","customerPhone","tripDate","tripTime","customAmount","customerNotes"].forEach(id=>$(id).value="");$("guestCount").value="4";$("excursion").value="Sunset Cruise";$("additionalHours").value="0";$("useCustomAmount").checked=false;$("subjectOutput").value="";$("emailOutput").textContent="Enter the booking details, then select “Generate email.”";$("status").textContent="Booking fields cleared.";updateAmount()}
["excursion","additionalHours","customAmount","useCustomAmount"].forEach(id=>{$(id).addEventListener("input",updateAmount);$(id).addEventListener("change",updateAmount)});
$("generateButton").addEventListener("click",buildEmail);$("resetButton").addEventListener("click",resetForm);$("copySubjectButton").addEventListener("click",()=>copyText($("subjectOutput").value,"Subject copied."));$("copyMessageButton").addEventListener("click",()=>copyText($("emailOutput").textContent,"Message copied."));updateAmount();
