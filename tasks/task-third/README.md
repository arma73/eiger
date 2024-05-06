## 1. Domain Serving Games:

`Question:` How can we design the system in a way that every Company will be able to serve games on their gaming site from their domain?

-----

`Answer:`

There are two main approaches to achieve this:

### Subdomain Approach:
  - Configure DNS server to create subdomains for each company (e.g., *company.gplatform.com*).
    There are a couple of ways to automate this process:

    1. **Dynamic DNS (DDNS) with Scripting:**
      - **Concept:** Dynamically create subdomains for each company through automated scripting.
      - **Implementation:**
        - Utilize DNS management APIs provided by domain registrar to programmatically add DNS records for subdomains.
        - Develop a script that triggers when a new company signs up for SaaS.
        - The script interacts with the DNS management API to create a new subdomain for the company (e.g., *company.gplatform.com*).
        - Update gPlatform database with the company information and link it to the newly created subdomain.

    2. **API Integration with Domain Registrar:**
      - **Concept:** Integrate signup process with the DNS management API of domain registrar.
      - **Implementation:**
        - Develop code that interacts with the DNS management API during company signup.
        - Automatically create a subdomain for the company using the provided domain name.
        - Update gPlatform database with company details and link it to the created subdomain.

    3. **Third-party DNS Management Tools:**
      - **Concept:** Utilize third-party tools specializing in DNS management for automated subdomain provisioning.
      - **Implementation:**
        - Explore tools like AWS Route 53 or Google Cloud DNS that offer APIs for programmatically managing DNS zones.
        - Integrate these tools with signup process to automate subdomain creation for new companies within gPlatform environment.

  - Update gPlatform server to identify the company based on the accessed subdomain. You can achieve this by parsing the hostname from the incoming request.

    **Web Server Configuration:**
    - **Virtual Hosting**

      Utilize virtual hosting features of web server (e.g., Apache, Nginx) to automatically extract company information from subdomains.
        1. **Virtual Host Configuration:**
          - Configure web server to use virtual hosting based on domain names. This allows it to serve different content or applications based on the accessed hostname.
        2. **Server Name Identification:**
          - Specify the expected domain or subdomain pattern within virtual host configuration.
          - For example, you could set `Server Name *.gplatform.com` (Apache) or `server_name ~ ^(.+)\.gplatform\.com$` (Nginx) to capture any subdomain under e.g. *gplatform.com*.
        3. **Extracting Company Information:**
          - Once the server identifies the matching virtual host based on the subdomain, you can access the captured hostname information using server variables.
          - In Apache, use the `%1` variable within application code to access the subdomain portion (e.g., *companyA*).
          - In Nginx, use the `$http_host` variable and perform string manipulation to extract the company identifier from the captured hostname.
        4. **Linking Company Information:**
          - With the extracted company identifier (e.g., *companyA*), you can then reference gPlatform database to retrieve the complete company details associated with that subdomain.
          - This information can be used to dynamically serve the appropriate games, user data, and functionalities specific to that company's instance on platform.

    - **Cloud-based**

      Leverage a cloud-based solution for multi-tenant gPlatform SaaS
        1. **Cloud Load Balancing with Path-Based Routing:**
          - Utilize a **cloud load balancer (CLB)** service (e.g., *AWS Elastic Load Balancing*, *Google Cloud Load Balancing*) configured for path-based routing.
        2. **API Gateway with Company Identifiers:**
          - Implement an **API Gateway service** offered by cloud provider (e.g., *AWS API Gateway*, *Azure API Management*). This serves as a single entry point for all API requests, identifying companies based on the requested path or domain..
    
### Custom Domain Mapping:
  1. **Domain Registration and Validation**
    - **Domain Registration:**
      - Allow companies to register their desired domain name during signup (e.g., *cool-games.com*).
      - Utilize a domain validation service offered by domain registrar or a third-party provider like **Domain Validation Authority (DVA)** or **DNS Validation Authority (DVA)**. These services offer APIs to verify domain ownership.

    - **Domain Validation Implementation (Example):**
      1. When a company enters their domain name during signup, initiate a domain validation request using the chosen validation service's API.
      2. The API typically generates a unique verification code.
      3. Create a DNS TXT record for the company's domain with the provided verification code. This can be done programmatically by interacting with the company's DNS management interface (if they provide an API) or by sending them instructions on how to create the record manually.
      4. Call the validation service's verification API with the domain name and verification code.
      5. The service checks the DNS record and confirms domain ownership if the code matches.
      6. Upon successful validation, store the company information, including the validated domain name, in gPlatform database.

  2. **DNS Configuration and Routing**
    - **CNAME Record Creation:**
      - Once a domain is validated, companies need to configure their DNS server to point the domain to gPlatform platform.
      - This can be achieved by creating a CNAME record for the company's domain (e.g., *cool-games.com*) that points to platform's domain or a dedicated subdomain you create for custom domains.
      - Alternatively, some platforms offer a wildcard CNAME record setup pointing to platform, allowing any subdomain under their domain to be mapped.

    - **Routing on gPlatform Server:**
      - Implement logic within gPlatform server to identify the company based on the accessed domain name.
      - Utilize a web server like Apache or Nginx with server name identification features.
      - Configure server blocks (Nginx) or virtual hosts (Apache) to match against the accessed domain name.
      - Upon a matching domain, extract the company identifier from the hostname (e.g., *cool-games* from *cool-games.com*).
   
      *Example (Nginx)*
      
      ```
        server {
          server_name ~ ^(.+)\.gplatform\.com$;

          set $company_identifier $1;

          location / {
            # E.G.:
            rewrite ^/$company_identifier/(.*) /$1 break;
            proxy_pass http://backend_server/$company_identifier/$1;
          }
        }
      ```

## 2. Database Design

`Question:` What modification should be done to the users table at gPlatform to support this change?

-----

`Answer:`

### 1. Adding the Company ID field.

  - **New Column:** Add a new column to the users table. It can be named *company_id* or *gaming_site_id* depending on preference.
  - **Data Type:** Select an appropriate data type for the column. Typically, an integer (such as INT in MySQL) is used to represent the unique company/gaming_site identifier.

  ```sql
    ALTER TABLE users
    ADD COLUMN company_id INT NOT NULL;
  ```

  - **Storing a unique identifier in the email field:** While email is not ideal as a primary key due to potential duplicates across companies, it can still serve as a unique identifier within a single company if properly validated.

### 2. Foreign Key

  - **Separate table of companies/gaming sites:** Create a separate table to store information about companies or gaming sites. This table can be called *companies* or *gaming_sites*.
  - **Primary Key:** Define a primary key for this table. This can be an autoincremental integer (e.g. ID) to uniquely identify each company/gaming site.
  - **Private key constraint:** Establish a foreign key relationship between the *company_id* column in the users table and the primary key of the *companies* table. This ensures data integrity and allows company/gaming_site information to be referenced on a per-user basis.

  ```sql
    CREATE TABLE companies (
      ID INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      domain_name VARCHAR(255) UNIQUE NOT NULL,
    );

    ALTER TABLE users
    ADD CONSTRAINT FK_user_company FOREIGN KEY (company_id)
    REFERENCES companies(ID);
  ```


## 3. User Login Validation

`Question:` Considering we have 1 backend cluster that serves all companies, how can we validate a user login on one gaming domain in such a way that it does not give access to a different gaming domain? (i.e. authenticating on site A, grants access to site A only).

-----

`Answer:`

To make sure that authenticating a user to one game domain only grants access to that specific domain and not others, you can apply domain-based authentication and session management techniques. Here is how this can be accomplished:

1. **Domain-based authentication:**
  - When a user attempts to log in, the authentication process must include verification of the domain associated with the user account.
  - Verify that the user's credentials are correct and that the domain associated with the user matches the domain of the game site the user is trying to access.
  - If the domain matches, proceed to grant access. Otherwise, deny access and display the appropriate error message.

2. **Session Management:**
  - After successful authentication, create a session token for the user.
  - Include domain information in the session token or associate it with the session data.
  - Store the session token securely on the client side (e.g., as a cookie) and check it on subsequent requests.
  - Ensure that the session token is bound to a specific domain, i.e. can only be used to access resources in that domain.

3. **Cross-domain security measures:**
  - Implement cross-domain security measures to prevent unauthorized access across domains.
  - For example, configure Cross-Origin Resource Sharing (CORS) policies to restrict requests from other domains.
  - Use HTTP headers such as `Origin` and `Referer` to verify the source of incoming requests and provide domain-specific access control.

4. **Session Revocation and Expiration:**
  - Implement mechanisms to revoke or expire sessions when necessary.
  - For example, if a user logs out or their session becomes inactive for a certain period, revoke the session token associated with that domain.
  - Ensure that expired or revoked session tokens cannot be reused to access the game site.

5. **Logging and Monitoring:**
  - Implement logging and monitoring functionalities to track authentication attempts and session activities.
  - Monitor for suspicious activities or unauthorized access attempts across different domains and take appropriate actions if detected.
