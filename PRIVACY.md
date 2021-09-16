# isTrust - PRIVACY POLICY

The isTrust browser addon and its extension isTrust-API (collectively named hereafter the "software") is operated by Internet Society Chapter Belgium vzw/asbl (“ISOC.be”), registered in Belgium under company number 0728.764.958, established Notelaarsstraat 285 rue du Noyer, 1000 Brussels (hereafter "we" or "us").

This software respects your privacy as much as possible. By design, we only process the minimum data necessary for your use of the software.

During the installation and/or version update of the software, the browser addon will contact a server (isTrust-API), getting your IP address and software version installed on your device. From this IP address your location is determined and the closest Internet Society Chapter computed, with purpose to display the appropriate link under the info button.

At server side (isTrust-API), data are segregated this way:

1. For the purpose of general statistics and to size and monitor our services accordingly, following are kept: date, software version and country. Those information does not allow us to re-identify the individual;

2. For the sole purpose to protect our servers and have ways to block traffic from IP addresses abusing/attacking us, we reserve the right to store requestors’ IP addresses for a maximum period of 30 days. We do not share this information with any third party, and we keep this data in a separated zone where accesses are restricted.

During your use of this software, the browser extension will call several services to gather various information about domain names and certificates:

1. DOMAIN. For the domain info, the official services of the TLD (top level domain) are consulted, and services referenced by them. isTrust gets the list of official services from IANA, being the “Internet Assigned Numbers Authority” and sole global coordinator for Domain Name Services (DNS). You can find the list of TLD here: https://www.iana.org/domains/root/db.

A first way to consult domain information is to use the RDAP propocol; isTrust gets the list of TLD supporting LDAP protocol from https://data.iana.org/rdap/dns.json. For example, if you go to https://be.brussels, we will get data of this domain name from https://rdap.nic.brussels/. See https://docs.dnsbelgium.be/gtld/rdap/introduction.html for more info. For certain TLD’s, the service referenced by IANA can itself provides some basic information only, and refers to a second service to retrieve more information. When there’s no RDAP, the official TLD can provide a public API or WHOIS or similar service. For instance for a “.be” website, it is DNS Belgium, also listed by IANA, being consulted.

The collection and processing of your data by the latter will be done under their sole responsibility (as separate data controllers). We invite you to read the privacy notices and other documents published on their websites for that purpose.

2. SECURITY. To check and collect of information on HTTPS certificates, any browser extension cannot access certificates’ data itself for security and technical reasons, that’s why the browser extension calls a second service of isTrust-API to get data that will be displayed in the “Security” section. No personal data is stored, including your IP address.

If you have any question about the processing of your personal data (including about your rights to access and to rectification on the data, and your other rights) feel free to contact DPO@isoc.be. Alternatively you can always contact the Belgian Data Protection Authority (https://www.dataprotectionauthority.be/citizen).
