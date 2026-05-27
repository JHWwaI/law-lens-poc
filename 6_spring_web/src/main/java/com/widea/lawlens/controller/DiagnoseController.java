package com.widea.lawlens.controller;

import com.widea.lawlens.domain.DiagnosisHistory;
import com.widea.lawlens.dto.DiagnoseRequest;
import com.widea.lawlens.repository.DiagnosisHistoryRepository;
import com.widea.lawlens.service.DiagnoseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class DiagnoseController {

    private final DiagnoseService diagnoseService;
    private final DiagnosisHistoryRepository repository;

    public DiagnoseController(DiagnoseService diagnoseService, DiagnosisHistoryRepository repository) {
        this.diagnoseService = diagnoseService;
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("diagnoseRequest", new DiagnoseRequest());
        return "index";
    }

    @PostMapping("/diagnose")
    public String diagnose(@Valid @ModelAttribute DiagnoseRequest diagnoseRequest,
                           BindingResult bindingResult, Model model,
                           HttpServletRequest req) {
        if (bindingResult.hasErrors()) {
            return "index";
        }
        DiagnosisHistory result = diagnoseService.diagnose(diagnoseRequest.getFact(), clientIp(req));
        model.addAttribute("result", result);
        return "result";
    }

    @GetMapping("/history")
    public String history(@RequestParam(defaultValue = "0") int page, Model model) {
        var pageData = repository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, 20));
        model.addAttribute("page", pageData);

        long art3  = repository.countByArticle("제3조");
        long art11 = repository.countByArticle("제11조");
        long art13 = repository.countByArticle("제13조");
        long art12_3 = repository.countByArticle("제12조의3");
        model.addAttribute("stats", new long[]{art3, art11, art13, art12_3});
        return "history";
    }

    private static String clientIp(HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null && !fwd.isBlank()) return fwd.split(",")[0].trim();
        return req.getRemoteAddr();
    }
}
